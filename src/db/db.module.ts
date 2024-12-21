import { Module } from '@nestjs/common';
import { UserRepositoryClass } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { BookRepositoryClass } from './book.repository';
import { FactRecordSchema } from './schemas/fact.schema';
import { JokeRecordSchema } from './schemas/joke.schema';
import { GamerSchema } from './schemas/gamer.schema';
import { GamerRepositoryClass } from './gamer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Fact', schema: FactRecordSchema },
      { name: 'Joke', schema: JokeRecordSchema },
      {name: 'Gamer', schema: GamerSchema}
    ]),
  ],
  providers: [UserRepositoryClass, BookRepositoryClass, GamerRepositoryClass],
  exports: [MongooseModule],
})
export class DbModule {}
