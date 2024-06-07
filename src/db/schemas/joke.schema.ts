import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class JokeRecord {
  @Prop({required: true})
  author: string;

  @Prop({required: true})
  tgId: number;

  @Prop({required: true})
  text: string;
}

export type TJokeRecord = HydratedDocument<JokeRecord>;
export const JokeRecordSchema = SchemaFactory.createForClass(JokeRecord);
