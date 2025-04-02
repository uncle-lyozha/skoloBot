import { Injectable } from '@nestjs/common';
import { Ctx, InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import * as testScript from '../utils/test.json';
import * as menuJson from '../utils/menu.json';
import {
  BattleJSONType,
  GameJSONType,
  GameScriptJSONType,
  GamesMenuJSONType,
  StoryJSONType,
} from 'src/utils/types';
import { SceneContext } from 'telegraf/typings/scenes';
import { GameEnum, StepTypeEnum } from 'src/utils/const';
import { TGamer } from 'src/db/schemas/gamer.schema';

@Injectable()
export class MessageService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  private testGameScript: GameJSONType = testScript;
  private menuJson: GamesMenuJSONType = menuJson;

  async showGamesMenu(userId: number, ctx: SceneContext) {
    const { buttons, text } = this.menuJson['gamesMenu'];
    const buttonsArray = buttons.map((button) => [
      { text: button.text, callback_data: button.game },
    ]);

    try {
      // await ctx.deleteMessage();
      await this.bot.telegram.sendMessage(userId, text, {
        reply_markup: {
          inline_keyboard: buttonsArray,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async sendStoryMessage(gamer: TGamer, ctx: SceneContext) {
    let gameScript: GameJSONType;
    let subScript: StoryJSONType | BattleJSONType;
    if (gamer.currentGame === GameEnum.test) {
      gameScript = this.testGameScript;
    }
    const stepType = gamer.currentStep.split(':')[0];
    const stepName = gamer.currentStep.split(':')[1];
    if (stepType === StepTypeEnum.story) {
      subScript = gameScript.story;
    }
    if (stepType === StepTypeEnum.battle) {
      subScript = gameScript.battle;
    }
    const { reply, buttons } = subScript[stepName];

    const buttonsArray = buttons.map((button) => [
      { text: button.text, callback_data: button.nextStep },
    ]);

    try {
      // await ctx.deleteMessage();
      await this.bot.telegram.sendMessage(gamer.tgId, reply, {
        reply_markup: {
          inline_keyboard: buttonsArray,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async hideKeyboard(@Ctx() ctx: Context) {
    await ctx.editMessageReplyMarkup({
      reply_markup: { remove_keyboard: true },
    } as any);
  }
}
