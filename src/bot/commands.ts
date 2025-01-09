import { Injectable } from '@nestjs/common';
import {
  Action,
  Command,
  Ctx,
  InjectBot,
  Sender,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import * as menuScript from '../utils/script.json';
import * as gameScript from '../utils/gameScript.json';
import { GameScriptType, ScriptType } from 'src/utils/types';
import { BookRepositoryClass } from 'src/db/book.repository';
import { GamerRepositoryClass } from 'src/db/gamer.repository';
import { TGamer } from 'src/db/schemas/gamer.schema';
import { GameEnum, SceneTypeEnum } from 'src/utils/const';
import { MessageService } from 'src/services/message.service';

@Injectable()
@Update()
export class CommandsClass {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly bookRep: BookRepositoryClass,
    private readonly gamerRep: GamerRepositoryClass,
    private readonly messageService: MessageService,
  ) {
    this.initializeBotCommands();
  }

  private script: ScriptType = menuScript;

  async initializeBotCommands() {
    const commands = [
      { command: 'addfact', description: this.script.commands.addfact },
      { command: 'addjoke', description: this.script.commands.addjoke },
      { command: 'fact', description: this.script.commands.fact },
      { command: 'joke', description: this.script.commands.joke },
    ];
    await this.bot.telegram.deleteMyCommands();
    await this.bot.telegram.setMyCommands(commands, {
      scope: { type: 'all_group_chats' },
    });
  }

  @Start()
  async start(
    @Ctx() ctx: SceneContext,
    @Sender('id') id: number,
    @Sender('username') userName: string,
  ) {
    const msg = `Hi ${userName}. Отправь команду /game, чтобы начать игру.`;
    const skolHeartSticker = await ctx.sendSticker(
      'CAACAgIAAxkBAAIJlWZjLcEogQfuwNYM6z54RSFL8lBWAAIBAAP1orgb_3Txv0gPw3E1BA',
    );
    await ctx.reply(msg);
    // this.messageService.sendStoryMessage(id, ctx, 'start');
  }

  @Command('addfact')
  async addFact(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('addfact');
  }

  @Command('addjoke')
  async addJoke(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('addjoke');
  }

  @Command('joke')
  async joke(@Ctx() ctx: SceneContext) {
    const joke = await this.bookRep.getRandomJoke();
    const msg = `Внимание, шутка:\n"${joke.text}"\nЮморит за стойкой ${joke.author}.`;
    await ctx.reply(msg);
  }

  @Command('fact')
  async fact(@Ctx() ctx: SceneContext) {
    const fact = await this.bookRep.getRandomFact();
    const msg = `А вы знали, что\n"${fact.text}" \nБлещет эрудицией ${fact.author}.`;
    await ctx.reply(msg);
  }

  // for testing only
  @Command('game')
  async game(@Ctx() ctx: SceneContext, @Sender('id') id: number) {
    this.messageService.showMainMenu(id, ctx);
  }

  // To be only used in the private chat with SkoloBot
  @Command('speak')
  async speak(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('speak');
  }
}
