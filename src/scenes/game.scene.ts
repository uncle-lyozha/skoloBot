import { Injectable } from '@nestjs/common';
import {
  Action,
  Ctx,
  InjectBot,
  Scene,
  SceneEnter,
  Sender,
  Update,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update as TypeGramUpdate } from 'telegraf/typings/core/types/typegram';
import { Markup, Scenes, Telegraf } from 'telegraf';
import * as notValidatedJson from '../utils/gameScript.json';
import { GameScriptType } from 'src/utils/types';

@Injectable()
@Scene('game')
export class GameScene {
  private script: GameScriptType = notValidatedJson;
  private currentStep = 'start';

  constructor(@InjectBot() private bot: Telegraf<Scenes.SceneContext>) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    const { buttons, replies } = this.script[this.currentStep];
    for (let reply of replies) {
      if (reply.type === 'text') {
        const buttonsArray = buttons.map((button) => [
          { text: button.text, callback_data: button.nextStep },
        ]);

        try {
          await ctx.editMessageText(
            reply.message,
            Markup.inlineKeyboard(buttonsArray),
          );
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  @Action('dice')
  async onDice(@Ctx() ctx: SceneContext) {
    const diceMsg = await ctx.sendDice();
    const messageId = diceMsg.message_id;
    console.log(messageId)
    setTimeout(() => {
      ctx.deleteMessage(messageId);
    }, 2000);
    await ctx.scene.leave();
  }

  @Action(/.*/)
  async onAnswer(
    @Ctx()
    ctx: SceneContext & { update: TypeGramUpdate.CallbackQueryUpdate },
  ) {
    await ctx.answerCbQuery('Poop!');
    const cbQuery = ctx.update.callback_query;
    const nextStep = 'data' in cbQuery ? cbQuery.data : null;
    if (nextStep === 'leave') {
      await ctx.scene.leave();
      await ctx.deleteMessage();
    } else {
      this.currentStep = nextStep;
      await ctx.scene.reenter();
    }
  }
}
