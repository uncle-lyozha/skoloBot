import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { CommandsClass } from './commands';
import { ListenerClass } from './listeners';
import { UserRepositoryClass } from 'src/db/user.repository';
import { DbModule } from 'src/db/db.module';
import { UserSchemaClass } from 'src/db/schemas/user.schema';

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            useFactory: () => ({
                token: process.env.BOT_TOKEN as string,
                middlewares: [Telegraf.log()],
            }),
        }),
        DbModule
    ],
    providers: [CommandsClass, ListenerClass, UserRepositoryClass, UserSchemaClass]
})
export class BotModule {}
