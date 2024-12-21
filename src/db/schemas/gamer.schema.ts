import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class GamerSchemaClass {
  @Prop({ required: true })
  tgId: number;

  @Prop()
  first_name: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  game: [
    { name: string; currentScene: string; features?: string; points?: number },
  ];
}

export type TGamer = HydratedDocument<GamerSchemaClass>;
// export type JobType = JobDocument & { _id: ObjectId };

export const GamerSchema = SchemaFactory.createForClass(GamerSchemaClass);
