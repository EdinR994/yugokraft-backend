
import { Module } from '@nestjs/common';
import { PinoLogger } from './logger';

@Module({
    providers:
    [
        {
            provide: 'LoggerService',
            useFactory: () => PinoLogger.construct()
        }
    ],
    exports:
    [
        {
            provide: 'LoggerService',
            useFactory: () => PinoLogger.construct()
        }
    ],
})
export class LoggerModule {}