import { Module } from '@nestjs/common';
import { UserRepositoryClass } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [UserRepositoryClass],
  exports: [MongooseModule]
})
export class DbModule {}
