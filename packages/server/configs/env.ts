export const Env = {
  PORT: process.env.PORT || 8888,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || '5444'),
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASS: process.env.DB_PASS || 'postgres',
  DB_NAME: process.env.DB_NAME || 'graph-talk',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
};
