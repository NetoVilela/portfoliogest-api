import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { KnowledgesModule } from './knowledges/knowledges.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { CoursesModule } from './courses/courses.module';
import { ContactsModule } from './contacts/contacts.module';
import { ImagesModule } from './images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      synchronize: true,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist'),
    }),
    UsersModule,
    AuthModule,
    PortfoliosModule,
    KnowledgesModule,
    ProjectsModule,
    ExperiencesModule,
    CoursesModule,
    ContactsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
