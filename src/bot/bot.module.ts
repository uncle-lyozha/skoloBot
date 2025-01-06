import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { Telegraf, session } from 'telegraf';
import { CommandsClass } from './commands';
import { ListenerClass } from './listeners';
import { UserRepositoryClass } from 'src/db/user.repository';
import { DbModule } from 'src/db/db.module';
import { AddFactWizard } from 'src/scenes/addFact.wizard';
import { BookRepositoryClass } from 'src/db/book.repository';
import { AddJokeWizard } from 'src/scenes/addJoke.wizard';
import { SpeakWizard } from 'src/scenes/speak.wizard';
import { GameScene } from 'src/scenes/game.scene';
import { GamerRepositoryClass } from 'src/db/gamer.repository';
import { BattleScene } from 'src/scenes/battle.scene';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process.env.BOT_TOKEN as string,
        middlewares: [session(), Telegraf.log()],
      }),
    }),
    DbModule,
  ],
  providers: [
    CommandsClass,
    ListenerClass,
    UserRepositoryClass,
    GamerRepositoryClass,
    BookRepositoryClass,
    AddFactWizard,
    AddJokeWizard,
    GameScene,
    BattleScene,
    SpeakWizard
  ],
})
export class BotModule {}
