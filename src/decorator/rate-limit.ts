import { applyDecorators, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GqlThrottlerGuard } from '../guard/gql-throttler.guard';

export const RateLimit = (limit: number, ttl: number) =>
  applyDecorators(
    UseGuards(GqlThrottlerGuard),
    Throttle(limit, ttl),
  );
