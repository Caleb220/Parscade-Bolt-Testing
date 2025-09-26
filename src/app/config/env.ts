import { buildEnv } from '@/shared/schemas/env';

export const env = buildEnv(import.meta.env);

export type { AppEnv } from '@/shared/schemas/env';
