import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserSchemaClass {
  @Prop({ required: true })
  tgId: number;

  @Prop()
  first_name: string;

  @Prop({ required: true })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
