import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT ?? 8000,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  API_PREFIX: process.env.API_PREFIX ?? "api/v1",
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};

export default config;
