import { Ctx, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import { BookRepositoryClass } from 'src/db/book.repository';
import { WizardContext } from 'telegraf/typings/scenes';
import * as notValidatedJson from '../utils/script.json';
import { ScriptType } from 'src/utils/types';

@Wizard('addfact')
export class AddFactWizard {
  constructor(private readonly bookRep: BookRepositoryClass) {}

  private script: ScriptType = notValidatedJson;

  @WizardStep(1)
  async onEnter(@Ctx() ctx: WizardContext) {
    const msg = this.script.addFactWiz.onEnter;
    await ctx.reply(msg);
    ctx.wizard.next();
  }

  @WizardStep(2)
  async onFact(
    @Ctx() ctx: WizardContext,
    @Sender('id') id: number,
    @Sender('username') userName: string,
  ) {
    const text = ctx.text;
    try {
      await this.bookRep.createFactRecord(userName, id, text);
      const msg = this.script.addFactWiz.onEnd;
      await ctx.reply(msg);
    } catch (err) {
      console.error(err);
    }
    await ctx.scene.leave();
  }
}
