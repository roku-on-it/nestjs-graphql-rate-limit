import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '../service/throttler-storage-redis.service';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        storage: new ThrottlerStorageRedisService({
          host: configService.get('STORE_HOST'),
          port: configService.get('STORE_PORT'),
          db: configService.get('STORE_THROTTLE_DB'),
        }),
      }),
    }),
  ],
  exports: [ThrottlerModule],
})
export class GqlRateLimitModule {}
