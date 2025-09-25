import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { EmailClassificationFormSchema } from '@/schemas/emailClassificationForm';
import type z from 'zod';

interface ClassificationResult {
  category: 'Productive' | 'Unproductive';
  confidence: number;
  suggestedResponse: string;
  processingTime?: number;
}

export function EmailClassificationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [activeTab, setActiveTab] = useState('text');

  const form = useForm<z.infer<typeof EmailClassificationFormSchema>>({
    resolver: zodResolver(EmailClassificationFormSchema),
    defaultValues: {
      inputMethod: 'text',
      emailText: '',
    },
  });

  const watchInputMethod = form.watch('inputMethod');

  async function classifyEmail(content: string): Promise<ClassificationResult> {
    const response = await fetch('/api/classify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Error classifying email');
    }

    return await response.json();
  }

  async function onSubmit(data: z.infer<typeof EmailClassificationFormSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      let emailContent = '';

      if (data.inputMethod === 'text' && data.emailText) {
        emailContent = data.emailText;
      } else if (data.inputMethod === 'file' && data.file) {
        if (data.file.type === 'text/plain') {
          emailContent = await data.file.text();
        } else if (data.file.type === 'application/pdf') {
          const formData = new FormData();
          formData.append('file', data.file);

          const response = await fetch('/api/process-pdf', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Error processing PDF');
          }

          const { content } = await response.json();
          emailContent = content;
        }
      }

      if (!emailContent.trim()) {
        throw new Error('Email content is empty');
      }

      const classificationResult = await classifyEmail(emailContent);
      setResult(classificationResult);

      toast.success('Email classified successfully!', {
        description: `Category: ${classificationResult.category}`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error processing email', {
        description: error instanceof Error ? error.message : 'Try again',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['text/plain', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file format', {
          description: 'Only .txt and .pdf files are supported',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast.error('File too large', {
          description: 'File must be less than 5MB',
        });
        return;
      }
      form.setValue('file', file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Automatic Email Classification</CardTitle>
          <CardDescription>Submit an email for automatic classification</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={value => {
                  setActiveTab(value);
                  form.setValue('inputMethod', value as 'text' | 'file');
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Enter Text
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="emailText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste the email content you want to classify here..."
                            className="min-h-[200px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Enter the full email text for analysis</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="file" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                      <FormItem className="w-fit mx-auto text-center flex flex-col items-center py-8">
                        <FormLabel className="text-center">File Upload</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".txt,.pdf"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors cursor-pointer">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {form.watch('file')?.name || 'Click to select a file'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  or drag and drop here
                                </span>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>Accepted formats: .txt, .pdf (max 5MB)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <Button type="submit" disabled={isLoading} className="w-fit flex mx-auto" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Classifying Email...
                  </>
                ) : (
                  'Classify Email'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge
                variant={result.category === 'Productive' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {result.category}
              </Badge>
              <span className="text-lg">Classification Result</span>
            </CardTitle>
            <CardDescription>
              Confidence: {(result.confidence * 100).toFixed(1)}%
              {result.processingTime && ` • Processed in ${result.processingTime}ms`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Suggested Response:</h4>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{result.suggestedResponse}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
