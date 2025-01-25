import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
class Game {
  @Prop({ required: true })
  step: string;

  @Prop({ type: Map, default: {} })
  features: Map<string, number>;

  @Prop({ type: Map, default: {} })
  weapons: Map<string, number>;

  @Prop({ type: Map, default: {} })
  armor: Map<string, number>;

  @Prop({ required: true, default: 0 })
  points: number;
}

export type TGame = HydratedDocument<Game>;

const GameSchema = SchemaFactory.createForClass(Game);

@Schema()
export class GamerSchemaClass {
  @Prop({ required: true })
  tgId: number;

  @Prop({ required: true })
  gamerName: string;

  @Prop({ required: true, default: '' })
  currentGame: string;

  @Prop({ type: Map, of: GameSchema, default: {} })
  games: Map<string, Game>;
}

export type TGamer = HydratedDocument<GamerSchemaClass>;

export const GamerSchema = SchemaFactory.createForClass(GamerSchemaClass);
