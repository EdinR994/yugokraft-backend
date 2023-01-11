import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CandidateModule } from './candidate/candidate.module';
import { KnexModule } from 'nestjs-knex'
import {EmployersModule} from "./employers/employers.module";
import { EmailModule } from './email/email.module';
import {DataModule} from "./data/data.module";
import {OwnerModule} from "./owners/owner.module";
import {StatisticsModule} from "./statistics/statistics.module";
import {ClockModule} from "./clock/clock.module";

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'postgres',
        connection: {
          host: process.env.DATABASE_HOST,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_DB
        },
        migrations: {
          tableName: 'migrations'
        },
        pool: {
          afterCreate: function(connection, callback) {
            connection.query(`SET TIMEZONE = 'Europe/Berlin';`, function(err) {
              callback(err, connection);
            });
          }
        }
      }
    }),
    AuthModule,
    CandidateModule,
    EmailModule,
    EmployersModule,
    DataModule,
    OwnerModule,
    StatisticsModule,
    ClockModule
],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
