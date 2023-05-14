import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './favorites.model';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [FavoritesService],
  controllers: [FavoritesController],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
