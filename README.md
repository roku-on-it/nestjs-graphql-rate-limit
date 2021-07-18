# NestJS GraphQL Rate Limit

A Rate Limit implementation for GraphQL APIs using NestJS

## Installation

```npm install nestjs-graphql-rate-limit```

## How to use it?


- After installing the package, make sure you have Redis installed and running.
  See [Redis Docker Image](https://hub.docker.com/_/redis)
- Set `STORE_HOST` `STORE_PORT` `STORE_THROTTLE_DB` environment variables in your Nest project.

Example:

```dotenv
#Depending on where you run and which hostname you set, set your hostname.
#If you run it locally you can set it to "localhost" or if you run it on Docker, you can set whatever hostname you gave.
STORE_HOST=redis
STORE_PORT=6379
#DB option is up to you between 0-15.
STORE_THROTTLE_DB=2
```

- Make sure you are returning the execution context

```typescript
GraphQLModule.forRoot({
  context: ({ req, res }) => ({ req, res }),
})
```

- Import `GqlThrottleModule` module into your Nest project. (Assuming you will throttle your Query & Mutations globally,
  importing into `AppModule` is highly recommended for availability reasons)

Example:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from 'src/app.resolver';
import { GraphQLError } from 'graphql';
import { GqlThrottleModule } from 'nestjs-graphql-rate-limit';

@Module({
  imports: [
    GqlThrottleModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      formatError: (error: GraphQLError) => {
        return {
          message: error.message,
          status: error.extensions.exception.status,
        };
      },
    }),
  ],
  providers: [AppResolver],
})
export class AppModule {}
```
---
## Usage
```typescript
// app.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';
import { RateLimit } from 'nesjs-graphql-rate-limit';

@Resolver()
export class AppResolver {
  @Query(() => String)
  @RateLimit(2, 10)
  async someQuery(): Promise<string> {
    return 'Hello from throttled query';
  }
}
```
---
## Documentation

- `RateLimit`

Takes `limit` `ttl` arguments in given order

Argument  | Type  | Description 
---    | ----  | -------
limit  | number| Amount of requests client can make in given TTL
ttl    | number| Time-to-live in seconds

Notes:

`@RateLimit(2, 10)` means, client can only make `2` requests in `10` seconds.

Expected behaviour:

After exceeding the limit of 2 requests, server will respond with `X-Retry-After` header and rate limit will reset after 10 seconds starting from the last second request.
