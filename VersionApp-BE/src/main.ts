import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

const server = express();

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  // Enable validation globally but allow unknown properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false, // Don't throw errors for unknown properties
    }),
  );

  app.enableCors();
  app.setGlobalPrefix('api');

  return app.init();
};

// For local development
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally but allow unknown properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false, // Don't throw errors for unknown properties
    }),
  );

  app.enableCors();
  app.setGlobalPrefix('api');

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// Start the server locally if not in production
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(async (request, response) => {
  await createNestServer(server);
  server(request, response);
});
