import "dotenv/config";
import * as joi from "joi";

interface EnvironmentVariables {
  PORT: number;
  JWT_SECRET_KEY: string;
  MONGO_URL: string;
  MONGO_DB_NAME: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_SERVER_ID: string;
  REDIRECT_URL: string;
  CLIENT_URL: string;
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
        DISCORD_CLIENT_ID: joi.string().required(),
        DISCORD_CLIENT_SECRET: joi.string().required(),
        DISCORD_SERVER_ID: joi.string().required(),
        REDIRECT_URL: joi.string().required(),
        CLIENT_URL: joi.string().default("*"),
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
      DISCORD_CLIENT_ID: envVars.DISCORD_CLIENT_ID,
      DISCORD_CLIENT_SECRET: envVars.DISCORD_CLIENT_SECRET,
      DISCORD_SERVER_ID: envVars.DISCORD_SERVER_ID,
      REDIRECT_URL: envVars.REDIRECT_URL,
      CLIENT_URL: envVars.CLIENT_URL,
    } as const;
  }
}

export const envs = EnvConfig.processEnv();
