import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [AuthenticateModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
