import z from "zod"

export const EmailClassificationFormSchema = z.object({
  inputMethod: z.enum(["text", "file"]),
  emailText: z.string().optional(),
  file: z.any().optional(),
}).refine((data) => {
  if (data.inputMethod === "text") {
    return data.emailText && data.emailText.trim().length >= 10
  }
  if (data.inputMethod === "file") {
    return data.file && data.file instanceof File
  }
  return false
}, {
  message: "Por favor, forneça um email válido (texto com pelo menos 10 caracteres ou arquivo)",
})