import { Injectable } from '@nestjs/common';
import {
  Command,
  Ctx,
  InjectBot,
  Sender,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import * as notValidatedJson from '../utils/script.json';
import { ScriptType } from 'src/utils/types';
import { BookRepositoryClass } from 'src/db/book.repository';

@Injectable()
@Update()
export class CommandsClass {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly bookRep: BookRepositoryClass,
  ) {
    this.initializeBotCommands();
  }

  private script: ScriptType = notValidatedJson;

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
    @Ctx() ctx: Context,
    @Sender('id') id: number,
    @Sender('username') userName: string,
  ) {
    const msg = `Hi ${userName}, your ID: ${id}.`;
    await ctx.reply(msg);
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
    const msg  = joke.text + `\nby ${joke.author}.`
    await ctx.reply(msg)
  }

  @Command('fact')
  async fact(@Ctx() ctx: SceneContext) {
    const fact = await this.bookRep.getRandomFact()
    const msg = fact.text + `\nby ${fact.author}.`
    await ctx.reply(msg)
  }

  // To be only used in the private chat with SkoloBot
  @Command('speak')
  async speak(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('speak');
  }
}
