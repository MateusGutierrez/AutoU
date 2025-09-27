import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
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
import { EmailClassificationFormSchema } from '@/schemas/emailClassificationForm';
import type z from 'zod';
import { useEmail } from '@/hooks/useEmail';
import SparkCard from '../card';

export function EmailClassificationForm() {
  const [activeTab, setActiveTab] = useState('text');
  const { classifyByText, loading, result, removeResult, classifyByFile } = useEmail();
  const form = useForm<z.infer<typeof EmailClassificationFormSchema>>({
    resolver: zodResolver(EmailClassificationFormSchema),
    defaultValues: {
      inputMethod: 'text',
      emailText: '',
    },
  });
  const watchInputMethod = form.watch('inputMethod');
  async function onSubmit(data: z.infer<typeof EmailClassificationFormSchema>) {
    if (data.inputMethod === 'text') {
      classifyByText(data.emailText as string);
    }
    if (data.inputMethod === 'file') {
      classifyByFile(data.file);
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
        toast.error('File too large', {
          description: 'File must be less than 5MB',
        });
        return;
      }
      form.setValue('file', file);
    }
  };
  const clear = useCallback(() => {
    removeResult();
    form.reset();
  }, [result]);
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
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

                <TabsContent value="text" className="space-y-6 py-8">
                  {result ? (
                    <SparkCard
                      content={result.suggested_response}
                      status={result.category}
                      confidence={result.confidence}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="emailText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste the email content you want to classify here..."
                              className="min-h-[100px] resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Enter the full email text for analysis</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </TabsContent>

                <TabsContent value="file" className="space-y-4">
                  {result ? (
                    <SparkCard
                      content={result.suggested_response}
                      status={result.category}
                      confidence={result.confidence}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="file"
                      render={() => (
                        <FormItem className="mx-auto flex w-fit flex-col items-center py-8 text-center">
                          <FormLabel className="text-center">File Upload</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <input
                                type="file"
                                accept=".txt,.pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                              />
                              <div className="border-muted-foreground/25 hover:border-muted-foreground/50 flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-4 transition-colors">
                                <Upload className="text-muted-foreground h-8 w-8" />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {form.watch('file')?.name || 'Click to select a file'}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
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
                  )}
                </TabsContent>
              </Tabs>
              {result ? (
                <Button
                  onClick={clear}
                  className="mx-auto flex w-fit"
                  size="lg"
                  variant={'secondary'}
                >
                  Clear
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="mx-auto flex w-fit" size="lg">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Classify Email'}
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
