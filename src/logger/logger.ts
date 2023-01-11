import {LoggerService, Logger, Injectable, Scope, Global} from "@nestjs/common";
import {LoggerOptions} from 'pino'
import {createWriteStream, promises} from 'fs';
import {join} from 'path';
import * as expressPinoLogger from 'express-pino-logger';
import * as pino from 'pino';

@Injectable({ scope: Scope.TRANSIENT })
export class PinoLogger extends Logger implements LoggerService  {

    private readonly logger = pino(this.options);

    private constructor(
        private readonly options: LoggerOptions,
        private readonly path?: string
    ) {
        super();
    }

    static construct() {
        return new PinoLogger({
            prettyPrint: false
        }, process.env.NODE_ENV === "production"
                ? '/var/log'
                : undefined
        );
    }

    public getExpressMiddleware() {
        return Boolean(this.path)
            ? expressPinoLogger({
                logger: pino(createWriteStream(join(this.path, `node-access.log`)))
            })
            : expressPinoLogger({
                logger: this.logger
            })
    }

    private getFileName(type: 'info' | 'error') {
        return join(this.path, `node-${type}-${new Date().toISOString().split("T")[0]}.log`);
    }

    private serializeMessage(message: any) {
        return '\n' + JSON.stringify({
            ...message,
            date: new Date().toISOString(),
            time: Date.now()
        })
    }

    private writeToFile(message: any, type: 'info' | 'error') {
        Boolean(this.path)
            ? setImmediate(async () => await promises.appendFile(this.getFileName(type), this.serializeMessage(message)))
            : null;
    }

    error(message: any, trace?: string, context?: string): any {
        this.writeToFile({ message, trace, context }, 'error')
        this.logger.error({ message, trace, context });
    }

    log(message: any, context?: string): any {
        this.writeToFile({ message, context }, 'info')
        this.logger.info(message, context);
    }

    warn(message: any, context?: string): any {
        this.writeToFile({ message, context }, 'info')
        this.logger.warn(message, context);
    }

}