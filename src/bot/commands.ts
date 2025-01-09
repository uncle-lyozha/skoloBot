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
    private readonly messageService: MessageService
  ) {
    this.initializeBotCommands();
  }

  private script: ScriptType = menuScript;
  private gameScript: GameScriptType = gameScript;
  private currentGame: GameEnum = GameEnum.odisseus;

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
    let gamer: TGamer = await this.gamerRep.findGamerByTgId(id);
    const currentStep = gamer.games.get(this.currentGame).scene;
    this.messageService.deleteAndSendMessage(id, ctx, 'start');

    // await ctx.reply(
    //   msg,
    //   Markup.inlineKeyboard([Markup.button.callback('Играть', 'game')]),
    // );
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

  @Command('game')
  async game(
    @Ctx() ctx: SceneContext,
    @Sender('id') id: number,
    @Sender('username') userName: string,
  ) {
    // await ctx.reply(
    //   'Играть',
    //   Markup.inlineKeyboard([Markup.button.callback('Играть', 'game')]),
    // );
  }

  // To be only used in the private chat with SkoloBot
  @Command('speak')
  async speak(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('speak');
  }

  // @Action('game')
  @Action(/^game/)
  async onGame(
    @Ctx() ctx: SceneContext,
    @Sender('id') id: number,
    @Sender('username') userName: string,
  ) {
    const gameName: GameEnum = GameEnum.odisseus;
    const firstStep = 'story:start';
    let gamer: TGamer = await this.gamerRep.findGamerByTgId(id);
    if (!gamer) {
      gamer = await this.gamerRep.createGamer(
        id,
        userName,
        gameName,
        firstStep,
      );
    }
    if (!gamer.games.get(gameName)) {
      await this.gamerRep.addGame(id, gameName, firstStep);
    }
    await this.gamerRep.updateStep(id, this.currentGame, firstStep);
    await ctx.scene.enter('game');
  }

  private async sendInlineMsg(userId, ctx, currentStep) {
    // const { buttons, replies } = this.script[currentStep];
    const { buttons, replies } = this.gameScript[currentStep];
    for (let reply of replies) {
      if (reply.type === 'text') {
        const buttonsArray = buttons.map((button) => [
          { text: button.text, callback_data: button.nextStep },
        ]);

        try {
          await ctx.deleteMessage();
          await this.bot.telegram.sendMessage(userId, reply.message, {
            reply_markup: {
              inline_keyboard: buttonsArray,
            },
          });
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}
