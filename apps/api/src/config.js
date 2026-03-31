require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || process.env.API_PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  databaseUrl: process.env.DATABASE_URL
};
