import {
  coreAuthStateSchema,
  createApiResponseSchema,
  pipelineStepSchema,
  routeConfigSchema,
  userSchema,
  type CoreAuthState,
  type PipelineStep,
  type User,
} from '../schemas/core';

import type { z } from 'zod';


export {
  coreAuthStateSchema,
  createApiResponseSchema,
  pipelineStepSchema,
  routeConfigSchema,
  userSchema,
};

export type { CoreAuthState as AuthState, PipelineStep, User };

export type RouteConfig = z.infer<typeof routeConfigSchema>;

export type ApiResponseSchema<TSchema extends z.ZodTypeAny> = ReturnType<typeof createApiResponseSchema<TSchema>>;

export type ApiResponse<TSchema extends z.ZodTypeAny> = z.infer<ApiResponseSchema<TSchema>>;

