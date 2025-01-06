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
// import * as gameScriptJson from '../utils/odisseus.json';
import * as gameScriptJson from '../utils/gameScript.json';
import { GameScriptType } from 'src/utils/types';
import { GamerRepositoryClass } from 'src/db/gamer.repository';
import { TGamer } from 'src/db/schemas/gamer.schema';
import { GameEnum, SceneTypeEnum } from 'src/utils/const';

@Injectable()
@Scene('game')
// @Update()
export class GameScene {
  private script: GameScriptType = gameScriptJson;
  private currentGame: GameEnum = GameEnum.odisseus;

  constructor(
    @InjectBot() private bot: Telegraf<Scenes.SceneContext>,
    private readonly gamerRep: GamerRepositoryClass,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext, @Sender('id') userId: number) {
    const gamer: TGamer = await this.gamerRep.findGamerByTgId(userId);
    const currentStep = gamer.games.get(this.currentGame).scene;
    const { buttons, replies } = this.script[currentStep];
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
      await ctx.deleteMessage();
      // !!! hardcode, avoid
      await this.gamerRep.updateStep(
        userId,
        this.currentGame,
        SceneTypeEnum.story + ':start',
      );
      await this.gamerRep.updatePoints(userId, this.currentGame, 1);
      // await this.gamerRep.updateGamerParam(userId, this.currentGame, 'points', 1)
      await ctx.scene.leave();
    }
  }
}
