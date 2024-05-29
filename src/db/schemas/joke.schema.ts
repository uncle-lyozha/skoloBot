import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class JokeRecord {
  @Prop({required: true})
  author: string;

  @Prop({required: true})
  tgId: number;

  @Prop({required: true})
  text: string;
}

export const JokeRecordSchema = SchemaFactory.createForClass(JokeRecord);
