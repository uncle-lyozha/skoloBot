import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import * as gameScript from '../utils/gameScript.json';
import * as menuJson from '../utils/gamesMenu.json';
import { GameScriptType, GamesMenuJSONType } from 'src/utils/types';

@Injectable()
export class MessageService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  private gameScript: GameScriptType = gameScript;
  private menuJson: GamesMenuJSONType = menuJson;

  async showMainMenu(userId, ctx) {
    const { buttons, text } = this.menuJson['menu'];
    const buttonsArray = buttons.map((button) => [
      { text: button.text, callback_data: button.game },
    ]);

    try {
    //   await ctx.deleteMessage();
      await this.bot.telegram.sendMessage(userId, text, {
        reply_markup: {
          inline_keyboard: buttonsArray,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async sendStoryMessage(userId, ctx, currentStep) {
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
