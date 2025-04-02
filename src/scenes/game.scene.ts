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
import { Scenes, Telegraf } from 'telegraf';
import { GamerRepositoryClass } from 'src/db/gamer.repository';
import { TGamer } from 'src/db/schemas/gamer.schema';
import { GameEnum, StepTypeEnum } from 'src/utils/const';
import { MessageService } from 'src/services/message.service';
import * as testScript from '../utils/test.json';

@Injectable()
@Scene('game')
export class GameScene {
  constructor(
    @InjectBot() private bot: Telegraf<Scenes.SceneContext>,
    private readonly gamerRep: GamerRepositoryClass,
    private readonly messageService: MessageService,
  ) {}

  private script = testScript;

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
    const sense =
      'sense' in this.script.story[step] ? this.script.story[step].sense : null;
    if (sense) {
      await ctx.answerCbQuery(sense);
    } else {
      await ctx.answerCbQuery();
    }

    if (stepType === StepTypeEnum.story) {
      await this.gamerRep.updateStep(gamerId, cbData);
      await ctx.scene.reenter();
    }

    if (stepType === StepTypeEnum.battle) {
      await this.gamerRep.updateStep(gamerId, cbData);
      await ctx.scene.leave();
      await ctx.scene.enter('battle');
    }

    if (stepType === StepTypeEnum.end) {
      // !!! hardcode, avoid
      await this.gamerRep.updateStep(gamerId, StepTypeEnum.story + ':start');
      await this.gamerRep.updatePoints(gamerId, gamer.currentGame, 1);
      // await this.gamerRep.updateGamerParam(gamerId, this.currentGame, 'points', 1)
      await ctx.scene.leave();
      await this.gamerRep.clearCurrentGame(gamerId);
      await this.messageService.hideKeyboard(ctx);
      await this.messageService.showGamesMenu(gamerId, ctx);
    }
  }
}
