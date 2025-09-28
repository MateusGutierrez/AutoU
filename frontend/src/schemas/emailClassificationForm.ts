import z from 'zod';

export const EmailClassificationFormSchema = z
  .object({
    inputMethod: z.enum(['text', 'file']),
    emailText: z.string().optional(),
    file: z.any().optional(),
  });
