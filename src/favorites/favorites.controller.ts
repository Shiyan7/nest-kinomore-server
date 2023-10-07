import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AtGuard } from 'src/auth/guards/at.guard';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @UseGuards(AtGuard)
  @Get('/check')
  async checkOne(@GetCurrentUserId() userId: string, @Query('id') id: number) {
    return this.favoritesService.checkOne(userId, id);
  }

  @UseGuards(AtGuard)
  @Get()
  async getAll(@GetCurrentUserId() userId: string) {
    return this.favoritesService.getAll(userId);
  }

  @UseGuards(AtGuard)
  @Post()
  async toggleOne(@GetCurrentUserId() userId: string, @Body('id') id: number) {
    return this.favoritesService.toggleOne(userId, id);
  }
}
