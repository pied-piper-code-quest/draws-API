import "dotenv/config";
import * as joi from "joi";

interface EnvironmentVariables {
  PORT: number;
  JWT_SECRET_KEY: string;
  MONGO_URL: string;
  MONGO_DB_NAME: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
}

class EnvConfig {
  static processEnv() {
    const envSchema = joi
      .object({
        PORT: joi.number().required(),
        JWT_SECRET_KEY: joi.string().required(),
        MONGO_URL: joi.string().required(),
        MONGO_DB_NAME: joi.string().required(),
        MONGO_USERNAME: joi.string().required(),
        MONGO_PASSWORD: joi.string().required(),
      })
      .unknown(true);

    const { error, value } = envSchema.validate(process.env);

    if (error) {
      throw new Error(`Environment config validation error: ${error.message}`);
    }

    const envVars: EnvironmentVariables = value;

    return {
      PORT: envVars.PORT,
      JWT_SECRET_KEY: envVars.JWT_SECRET_KEY,
      MONGO_URL: envVars.MONGO_URL,
      MONGO_DB_NAME: envVars.MONGO_DB_NAME,
      MONGO_USERNAME: envVars.MONGO_USERNAME,
      MONGO_PASSWORD: envVars.MONGO_PASSWORD,
    } as const;
  }
}

export const envs = EnvConfig.processEnv();
