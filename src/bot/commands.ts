import { Injectable } from '@nestjs/common';
import { Ctx, InjectBot, Sender, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
@Update()
export class CommandsClass {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Start()
  async start(
    @Ctx() ctx: Context,
    @Sender('id') id: number,
    @Sender('username') userName: string,
  ) {
    const msg = `Hi ${userName}, your ID: ${id}.`;
    await ctx.reply(msg);
  }
}
