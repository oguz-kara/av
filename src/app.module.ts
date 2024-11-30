import { Module } from '@nestjs/common'
import { GatewayModule } from '@av/gateway'
import { PrismaModule } from '@av/database'
import { ConfigModule } from '@nestjs/config'
import { appConfig } from 'config/app.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    GatewayModule,
    PrismaModule,
  ],
})
export class AppModule {}
