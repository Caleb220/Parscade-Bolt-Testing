import { buildEnv } from '@/schemas/env';

export const env = buildEnv(import.meta.env);

export type { AppEnv } from '@/schemas/env';