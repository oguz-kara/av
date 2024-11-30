import { ConfigFactory, ConfigObject } from '@nestjs/config'
import { supportedTypes } from './file-types.config'

export const appConfig: ConfigFactory<ConfigObject> = (): ConfigObject => ({
  server: {
    hostname: 'localhost',
    port: 3000,
    apiPaths: {
      protected: '/admin-api',
      public: '/shop-api',
    },
  },
  pagination: {
    limits: {
      max: 100,
      default: 25,
    },
    defaultPosition: 0,
  },
  authentication: {
    strategy: process.env.AUTH_STRATEGY,
    jwt: {
      expiresIn: '30s',
    },
    authorizationEnabled:
      process.env.AUTHORIZATION_ENABLED === 'true' ? true : false,
  },
  localization: {
    language: {
      default: 'en',
      available: ['en', 'fr'],
    },
    currency: {
      default: 'USD',
    },
  },
  asset: {
    imageExtension: 'webp',
    supportedTypes: supportedTypes,
    storage: {
      localPath: '/assets/preview',
      maxFileSize: 1024 * 1024 * 10,
      strategy: process.env.ASSET_STORAGE_STRATEGY || 'LOCAL',
      host: process.env.STORAGE_HOST,
      url: process.env.STORAGE_URL,
      aws: {
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_BUCKET,
      },
    },
    variation: {
      variationsEnabled: true,
      sizes: {},
    },
  },
})
