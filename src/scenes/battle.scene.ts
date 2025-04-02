import { Injectable } from '@nestjs/common';
import {
  Action,
  Ctx,
  InjectBot,
  On,
  Scene,
  SceneEnter,
  Sender,
  Update,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update as TypeGramUpdate } from 'telegraf/typings/core/types/typegram';
import { Markup, Scenes, Telegraf } from 'telegraf';
import { GamerRepositoryClass } from 'src/db/gamer.repository';
import { TGamer } from 'src/db/schemas/gamer.schema';
import { GameEnum, StepTypeEnum } from 'src/utils/const';
import { MessageService } from 'src/services/message.service';
import * as testGameScript from '../utils/test.json';
import { TStepOption } from 'src/utils/types';

@Injectable()
@Scene('battle')
export class BattleScene {
  constructor(
    @InjectBot() private bot: Telegraf<Scenes.SceneContext>,
    private readonly gamerRep: GamerRepositoryClass,
    private readonly messageService: MessageService,
  ) {}

  private script = testGameScript.battle;

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext, @Sender('id') gamerId: number) {
    const gamer: TGamer = await this.gamerRep.findGamerByTgId(gamerId);
    await this.messageService.hideKeyboard(ctx);
    await this.messageService.sendStoryMessage(gamer, ctx);
  }

  @On('callback_query')
  async onAnswer(
    @Ctx()
    ctx: SceneContext & { update: TypeGramUpdate.CallbackQueryUpdate },
    @Sender('id') gamerId: number,
  ) {
    const gamer: TGamer = await this.gamerRep.findGamerByTgId(gamerId);
    const cbQuery = ctx.update.callback_query;
    const cbData = 'data' in cbQuery ? cbQuery.data : null;
    const stepType = cbData.split(':')[0];
    const step = gamer.currentStep.split(':')[1];
    const sense = 'sense' in this.script[step] ? this.script[step].sense : null;
    if (sense) {
      await ctx.answerCbQuery(sense);
    } else {
      await ctx.answerCbQuery();
    }

    if (stepType === StepTypeEnum.dice) {
      let nextStep: string;
      const dice = await ctx.sendDice();
      const diceValue = dice.dice.value;
      const options: TStepOption = this.script[step].options;
      for (const [option, values] of Object.entries(options)) {
        if (values.includes(diceValue)) nextStep = option;
      }
      await this.gamerRep.updateStep(gamerId, nextStep);
      await ctx.scene.reenter();
    }

    if (stepType === StepTypeEnum.story) {
      await this.gamerRep.updateStep(gamerId, cbData);
      await ctx.scene.leave();
      await ctx.scene.enter('game');
    }

    if (stepType === StepTypeEnum.battle) {
      await this.gamerRep.updateStep(gamerId, cbData);
      await ctx.scene.reenter;
    }
  }
}
