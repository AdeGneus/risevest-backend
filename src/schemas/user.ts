import { z } from "zod";

const firstNameSchema = z
  .string()
  .trim()
  .min(1, "First name is required")
  .max(100, "First name can't exceed 100 characters");

const lastNameSchema = z
  .string()
  .trim()
  .min(1, "Last name is required")
  .max(100, "Last name can't exceed 100 characters");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password can't exceed 100 characters");

export const userSignUpSchema = z.object({
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type IUserSignUpSchema = z.infer<typeof userSignUpSchema>;
