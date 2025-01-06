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

@Injectable()
@Scene('battle')
export class BattleScene {
  private script: GameScriptType = battleScript;
  private currentGame: GameEnum = GameEnum.odisseus;
  private diceMsgId: number;

  constructor(
    @InjectBot() private bot: Telegraf<Scenes.SceneContext>,
    private readonly gamerRep: GamerRepositoryClass,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext, @Sender('id') gamerId: number) {
    const gamer: TGamer = await this.gamerRep.findGamerByTgId(gamerId);
    const currentStep = gamer.games.get(this.currentGame).scene;
    this.sendInlineMsg(ctx, currentStep);
  }

  @Action('dice')
  async onDice(@Ctx() ctx: SceneContext) {
    const diceMsg = await ctx.sendDice();
    this.diceMsgId = diceMsg.message_id;
    const diceValue = diceMsg.dice.value;
    this.sendInlineMsg(ctx, 'battle:second');
    console.log(diceValue);
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
    const nextStep = cbData.split(':')[1];

    if (stepType === SceneTypeEnum.story) {
      const step = SceneTypeEnum.story + ':' + nextStep;
      await this.gamerRep.updateStep(userId, this.currentGame, step);
      // await ctx.deleteMessage();
      // await ctx.deleteMessage(this.diceMsgId);
      await ctx.scene.leave();
      await ctx.scene.enter('game');
    }
    
    if (stepType === SceneTypeEnum.battle) {
      const step = SceneTypeEnum.battle + ':' + nextStep;
      await this.gamerRep.updateStep(userId, this.currentGame, step);
      await ctx.scene.reenter;
    }
  }
  
  private async sendInlineMsg(ctx, currentStep) {
    const { buttons, replies } = this.script[currentStep];
    for (let reply of replies) {
      if (reply.type === 'text') {
        const buttonsArray = buttons.map((button) => [
          { text: button.text, callback_data: button.nextStep },
        ]);
        
        try {
          await ctx.deleteMessage();
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
}
