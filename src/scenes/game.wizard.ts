import { Injectable } from '@nestjs/common';
import {
  Action,
  Ctx,
  InjectBot,
  Scene,
  SceneEnter,
  Sender,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update as TypeGramUpdate } from 'telegraf/typings/core/types/typegram';
import { Scenes, Telegraf } from 'telegraf';
import * as notValidatedJson from '../utils/gameScript.json';
import { GameScriptType } from 'src/utils/types';

@Injectable()
@Scene('game')
export class GameWizard {
  private script: GameScriptType = notValidatedJson;
  private currentStep = 'start';

  constructor(@InjectBot() private bot: Telegraf<Scenes.SceneContext>) {}

  @SceneEnter()
  async enter(@Ctx() context: SceneContext, @Sender('id') id: number) {
    const { buttons, replies } = this.script[this.currentStep];
    for (let reply of replies) {
      if (reply.type === 'text') {
        const inlineKeyboard = buttons.map((button) => [
          { text: button.text, callback_data: button.nextStep },
        ]);
        await this.bot.telegram.sendMessage(id, reply.message, {
          reply_markup: {
            inline_keyboard: inlineKeyboard,
          },
        });
      }
    }
  }

  @Action(/.*/)
  async onAnswer(
    @Ctx()
    context: SceneContext & { update: TypeGramUpdate.CallbackQueryUpdate },
  ) {
    console.log(context);
    const cbQuery = context.update.callback_query;
    const nextStep = 'data' in cbQuery ? cbQuery.data : null;
    if (nextStep === 'leave') {
      await context.scene.leave();
    } else {
      this.currentStep = nextStep;
      await context.scene.reenter();
    }
  }
}
