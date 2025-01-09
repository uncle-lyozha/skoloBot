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
import * as battleScript from '../utils/battleScript.json';
import { GameScriptType } from 'src/utils/types';
import { GamerRepositoryClass } from 'src/db/gamer.repository';
import { TGamer } from 'src/db/schemas/gamer.schema';
import { GameEnum, SceneTypeEnum } from 'src/utils/const';
import { MessageService } from 'src/services/message.service';

@Injectable()
@Scene('battle')
export class BattleScene {
  private script: GameScriptType = battleScript;
  private currentGame: GameEnum = GameEnum.odisseus;

  constructor(
    @InjectBot() private bot: Telegraf<Scenes.SceneContext>,
    private readonly gamerRep: GamerRepositoryClass,
    private readonly messageService: MessageService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext, @Sender('id') gamerId: number) {
    const gamer: TGamer = await this.gamerRep.findGamerByTgId(gamerId);
    const currentStep = gamer.games.get(this.currentGame).scene;
    this.messageService.sendStoryMessage(gamerId, ctx, currentStep);
  }

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

    if (stepType === SceneTypeEnum.story) {
      await this.gamerRep.updateStep(userId, this.currentGame, cbData);
      await ctx.scene.leave();
      await ctx.scene.enter('game');
    }

    if (stepType === 'dice') {
      const option1 = cbData.split(':')[1];
      const option2 = cbData.split(':')[2];
      const diceMsg = await ctx.sendDice();
      const diceValue = diceMsg.dice.value;
      console.log(option1, option2, diceValue);
      if (diceValue > 3) {
        this.messageService.sendStoryMessage(userId, ctx, option2);
      } else {
        this.messageService.sendStoryMessage(userId, ctx, option1);
      }
      // this.gamerRep.updateGamerParam(userId, this.currentGame, 'weapons', 'knife')
    }

    await this.gamerRep.updateStep(userId, this.currentGame, cbData);
    ctx.scene.reenter;
  }
}
