import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpires: process.env.JWT_EXPIRES,
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES,
}));
