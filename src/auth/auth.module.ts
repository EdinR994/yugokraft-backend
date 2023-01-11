import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import {AuthService} from "./domain/auth.service";
import {AuthServiceImpl} from "./domain/auth.service.impl";
import {SqlAuthRepository} from "./infrastructure/auth.repository";
import {BcryptPasswordHashingService} from "./infrastructure/passwordHashingService";
import {PasswordService} from "./domain/password.service";
import {SqlTokenRepository} from "./infrastructure/token.repository";
import {DomainEventsImpl} from "../../lib/domainEvents.impl";
import {AuthEvents} from "./api/auth.events";
import {LoggerModule} from "../logger/logger.module";

@Module({
  imports: [
      LoggerModule
  ],
  controllers: [
      AuthController
  ],
  providers: [
    {
      provide: 'AuthService',
      useClass: AuthServiceImpl
    },
    {
      provide: 'AuthRepository',
      useClass: SqlAuthRepository
    },
    {
      provide: 'PasswordHashingService',
      useValue: new BcryptPasswordHashingService()
    },
    {
      provide: 'TokenRepository',
      useClass: SqlTokenRepository,
    },
    {
      provide: 'DomainEvents',
      useValue: DomainEventsImpl.getInstance()
    },
    PasswordService,
    AuthEvents
  ],
  exports: [
      {
        provide: 'TokenRepository',
        useClass: SqlTokenRepository
      },
      {
        provide: 'AuthRepository',
        useClass: SqlAuthRepository
      }
    ]
})
export class AuthModule {}
