import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class FactRecord {
  @Prop({required: true})
  author: string;

  @Prop({required: true})
  tgId: number;

  @Prop({required: true})
  text: string;
}

export type TFactRecord = HydratedDocument<FactRecord>;
export const FactRecordSchema = SchemaFactory.createForClass(FactRecord);
