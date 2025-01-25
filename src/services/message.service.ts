import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import * as gameScript from '../utils/gameScript.json';
import * as battleScript from '../utils/battleScript.json';
import * as menuJson from '../utils/menu.json';
import { GameScriptJSONType, GamesMenuJSONType } from 'src/utils/types';
import { SceneContext } from 'telegraf/typings/scenes';
import { SceneTypeEnum } from 'src/utils/const';

@Injectable()
export class MessageService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  private gameScript: GameScriptJSONType = gameScript;
  private battleScript: GameScriptJSONType = battleScript;
  private menuJson: GamesMenuJSONType = menuJson;

  async showMainMenu(userId: number, ctx: SceneContext) {
    const { buttons, text } = this.menuJson['gamesMenu'];
    const buttonsArray = buttons.map((button) => [
      { text: button.text, callback_data: button.game },
    ]);

    try {
      await ctx.deleteMessage();
      await this.bot.telegram.sendMessage(userId, text, {
        reply_markup: {
          inline_keyboard: buttonsArray,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async sendStoryMessage(
    userId: number,
    ctx: SceneContext,
    currentStep: string,
  ) {
    let script: GameScriptJSONType;
    const stepType = currentStep.split(':')[0];
    const nextStep = currentStep.split(':')[1];
    if (stepType === SceneTypeEnum.story) {
      script = this.gameScript;
    }
    if (stepType === SceneTypeEnum.battle) {
      script = this.battleScript;
    }
    // const { buttons, replies } = this.script[currentStep];
    const { buttons, replies } = script[nextStep];
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
