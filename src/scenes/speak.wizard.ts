import { Ctx, InjectBot, Wizard, WizardStep } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { SceneContext, WizardContext } from 'telegraf/typings/scenes';

@Wizard('speak')
export class SpeakWizard {
  constructor(@InjectBot() private readonly bot: Telegraf<SceneContext>) {}

  @WizardStep(1)
  async onEnter(@Ctx() ctx: WizardContext) {
    const msg = 'What do you want to say to Skolo kult?';
    await ctx.reply(msg);
    ctx.wizard.next();
  }

  @WizardStep(2)
  async onMsg(@Ctx() ctx: WizardContext) {
    const msg = ctx.text;
    await this.bot.telegram.sendMessage(process.env.CHAT_ID, msg);
    await ctx.scene.leave();
  }
}
