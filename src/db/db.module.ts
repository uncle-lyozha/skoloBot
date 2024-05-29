import { Module } from '@nestjs/common';
import { UserRepositoryClass } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { BookRepositoryClass } from './book.repository';
import { FactRecordSchema } from './schemas/fact.schema';
import { JokeRecordSchema } from './schemas/joke.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Fact', schema: FactRecordSchema },
      { name: 'Joke', schema: JokeRecordSchema },
    ]),
  ],
  providers: [UserRepositoryClass, BookRepositoryClass],
  exports: [MongooseModule],
})
export class DbModule {}
