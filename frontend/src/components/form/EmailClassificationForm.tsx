import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';
import { FileText, Loader2, X, Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmailClassificationFormSchema } from '@/schemas/emailClassificationForm';
import type z from 'zod';
import { useEmail } from '@/hooks/useEmail';
import SparkCard from '../card';
import logo from '@/assets/sparkmail.png';
import { useEmailStore } from '@/store';

export function EmailClassificationForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { classifyByText, classifyByFile } = useEmail();
  const { loading, result, clearResult } = useEmailStore();
  const form = useForm<z.infer<typeof EmailClassificationFormSchema>>({
    resolver: zodResolver(EmailClassificationFormSchema),
    defaultValues: {
      inputMethod: 'text',
      emailText: '',
    },
  });
  const onSubmit = (data: z.infer<typeof EmailClassificationFormSchema>) => {
    if (selectedFile) {
      form.setValue('inputMethod', 'file');
      form.setValue('file', selectedFile);
      classifyByFile(selectedFile);
    } else if (data.emailText?.trim()) {
      form.setValue('inputMethod', 'text');
      classifyByText(data.emailText);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    form.setValue('inputMethod', 'file');
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
      setSelectedFile(file);
      form.setValue('file', file);
      form.setValue('emailText', '');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.setValue('file', undefined);
  };

  const clear = () => {
    clearResult();
    setSelectedFile(null);
    form.reset({
      inputMethod: 'text',
      emailText: '',
      file: undefined,
    });
  };

  const isFileSelected = selectedFile !== null;
  const hasTextContent = form.watch('emailText')?.trim() !== '';
  const canSubmit = (isFileSelected || hasTextContent) && !loading;
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <Card>
        <CardHeader className="flex items-center justify-center gap-2">
          <img src={logo} alt="logo" width={38} />
          <CardTitle className="flex items-center justify-center gap-2 text-center text-3xl">
            Olá, como posso te ajudar hoje ? 
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-6">
              {result ? (
                <SparkCard
                  content={result.suggested_response}
                  status={result.category}
                  confidence={result.confidence}
                  isUrgent={result.is_urgent}
                  clear={clear}
                />
              ) : (
                <div className="space-y-4">
                  {isFileSelected ? (
                    <div className="border-border bg-muted/50 flex items-center gap-3 rounded-lg border p-4">
                      <FileText className="text-muted-foreground h-5 w-5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={removeFile}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        type="submit"
                        disabled={!canSubmit}
                        className="flex items-center justify-center"
                        size="icon"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="emailText"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative cursor-pointer">
                              <div className="absolute bottom-3 left-3 cursor-pointer">
                                <input
                                  type="file"
                                  accept=".txt,.pdf"
                                  onChange={handleFileChange}
                                  className="absolute inset-0 z-10 h-6 w-6 cursor-pointer opacity-0"
                                  title="Escolha um arquivo"
                                />
                                <Paperclip className="text-muted-foreground hover:text-foreground h-5 w-5 cursor-pointer transition-colors" />
                              </div>
                              <Textarea
                                placeholder="Insira aqui o conteúdo de email que você quer classificar..."
                                className="min-h-[120px] resize-y"
                                {...field}
                                onClick={() => form.setValue('inputMethod', 'text')}
                              />
                              <Button
                                type="submit"
                                disabled={!canSubmit}
                                className="absolute right-3 bottom-3 mx-auto flex items-center justify-center"
                                size="icon"
                              >
                                {loading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                           Digite o texto do e-mail ou clique no ícone de upload para selecionar um arquivo (.txt, .pdf - máx. 5 MB)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
