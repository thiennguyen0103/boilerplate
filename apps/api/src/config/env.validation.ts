import { validatedEnvSchema } from './env.schema';
import { createConfiguration } from './configuration';

export function validateEnv(config: Record<string, unknown>) {
  const result = validatedEnvSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Environment validation failed:\n${errors}`);
  }

  const env = result.data;

  return {
    ...env,
    ...createConfiguration(env),
  };
}
