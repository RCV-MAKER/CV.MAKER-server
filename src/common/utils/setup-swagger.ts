import { type AppConfig } from '@config/app-config.type';
import { type AllConfigType } from '@config/config.type';
import { type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService<AllConfigType>);
  const appConfig = configService.getOrThrow<AppConfig>('app', { infer: true });

  const config = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setDescription(appConfig.name)
    .setVersion('1.0')
    .setContact('Company Name', 'https://example.com', 'contact@company.com')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'Api-Key', in: 'header' }, 'Api-Key')
    .addServer(appConfig.url, 'Development')
    .addServer(appConfig.url, 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: appConfig.name,
    swaggerOptions: {
      explore: true,
      deepLinking: true,
      persistAuthorization: true,
    },
  });
}

export default setupSwagger;
