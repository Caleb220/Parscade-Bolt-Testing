/**
 * Authentication Schema Definitions
 * Comprehensive validation for auth flows and user data
 */

import { z } from 'zod';
import { emailSchema, uuidSchema, timestampSchema } from '@/shared/schemas/core';

// User schema
export const authUserSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  user_metadata: z.object({
    full_name: z.string().optional(),
    avatar_url: z.string().url().optional(),
  }).optional(),
  email_confirmed_at: z.string().optional(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type User = z.infer<typeof authUserSchema>;

// Form errors
export const formErrorsSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
  fullName: z.string().optional(),
  username: z.string().optional(),
  general: z.string().optional(),
});

export type FormErrors = z.infer<typeof formErrorsSchema>;

// Password strength
export const passwordStrengthSchema = z.object({
  score: z.number().min(0).max(4),
  feedback: z.array(z.string()),
  isValid: z.boolean(),
});

export type PasswordStrength = z.infer<typeof passwordStrengthSchema>;

// Auth state
export const authStateSchema = z.object({
  user: authUserSchema.nullable(),
  isAuthenticated: z.boolean(),
  isEmailConfirmed: z.boolean(),
  isLoading: z.boolean(),
  error: z.string().nullable(),
});

export type AuthState = z.infer<typeof authStateSchema>;

// Auth context
export const authContextSchema = authStateSchema.extend({
  signIn: z.function().args(z.string(), z.string()).returns(z.promise(z.void())),
  signUp: z.function().args(z.string(), z.string(), z.string(), z.string()).returns(z.promise(z.void())),
  signOut: z.function().returns(z.promise(z.void())),
  resendConfirmationEmail: z.function().args(z.string()).returns(z.promise(z.void())),
  clearError: z.function().returns(z.void()),
});

export type AuthContextType = z.infer<typeof authContextSchema>;