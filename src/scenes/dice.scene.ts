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
@Scene('dice')
export class DiceScene {
  
  constructor(@InjectBot() private bot: Telegraf<Scenes.SceneContext>) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
  }

  @Action('dice')
  async onDice(@Ctx() ctx: SceneContext) {
    await ctx.sendDice();
    setTimeout(() => {
      ctx.deleteMessage();
    }, 2000);
    await ctx.scene.leave();
  }

  @Action(/.*/)
  async onAnswer(
    @Ctx()
    context: SceneContext & { update: TypeGramUpdate.CallbackQueryUpdate },
  ) {
    await context.answerCbQuery('Poop!');
    const cbQuery = context.update.callback_query;
    const nextStep = 'data' in cbQuery ? cbQuery.data : null;
    if (nextStep === 'leave') {
      await context.scene.leave();
      await context.deleteMessage();
    } else {
      await context.scene.reenter();
    }
  }
}
