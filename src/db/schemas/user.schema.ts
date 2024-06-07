import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class UserSchemaClass {
  @Prop({ required: true })
  tgId: number;

  @Prop()
  first_name: string;

  @Prop({ required: true })
  username: string;
}

export type TUser = HydratedDocument<UserSchemaClass>;
// export type JobType = JobDocument & { _id: ObjectId };

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
