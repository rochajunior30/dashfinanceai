import { z } from "zod";

export const upsertUserSchema = z.object({
  userId: z.string().optional(),
  name: z.string().trim().min(1, { message: "O nome é obrigatório." }),
  whatsapp: z.string().optional().trim(),
  email: z.string().email({ message: "O email deve ser válido." }),
  credits: z
    .number({ required_error: "Os créditos são obrigatórios." })
    .nonnegative({ message: "Os créditos não podem ser negativos." }),
});
