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
import { GameEnum, SceneTypeEnum } from 'src/utils/const';
import { MessageService } from 'src/services/message.service';

@Injectable()
@Scene('game')
export class GameScene {
  private currentGame: GameEnum = GameEnum.odisseus;

  constructor(
    @InjectBot() private bot: Telegraf<Scenes.SceneContext>,
    private readonly gamerRep: GamerRepositoryClass,
    private readonly messageService: MessageService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext, @Sender('id') userId: number) {
    const gamer: TGamer = await this.gamerRep.findGamerByTgId(userId);
    const currentStep = gamer.games.get(this.currentGame).step;
    console.log(currentStep)
    await this.messageService.sendStoryMessage(userId, ctx, currentStep);
  }

  // @Action(/.*/)
  @On('callback_query')
  async onAnswer(
    @Ctx()
    ctx: SceneContext & { update: TypeGramUpdate.CallbackQueryUpdate },
    @Sender('id') userId: number,
  ) {
    await ctx.answerCbQuery('Poop!');
    const cbQuery = ctx.update.callback_query;
    const cbData = 'data' in cbQuery ? cbQuery.data : null;
    const stepType = cbData.split(':')[0];
    const nextStep = cbData.split(':')[1];

    if (stepType === SceneTypeEnum.story) {
      await this.gamerRep.updateStep(userId, this.currentGame, cbData);
      await ctx.scene.reenter();
    }

    if (stepType === SceneTypeEnum.battle) {
      await this.gamerRep.updateStep(userId, this.currentGame, cbData);
      await ctx.scene.leave();
      await ctx.scene.enter('battle');
    }

    if (stepType === SceneTypeEnum.end) {
      // !!! hardcode, avoid
      await this.gamerRep.updateStep(
        userId,
        this.currentGame,
        SceneTypeEnum.story + ':start',
      );
      await this.gamerRep.updatePoints(userId, this.currentGame, 1);
      // await this.gamerRep.updateGamerParam(userId, this.currentGame, 'points', 1)
      await ctx.scene.leave();
      await this.gamerRep.clearCurrentGame(userId)
      await this.messageService.showMainMenu(userId, ctx)
    }
  }
}
