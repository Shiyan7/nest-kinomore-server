import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get('/check')
  async checkOne(@GetCurrentUserId() userId: string, @Query('id') id: number) {
    return this.favoritesService.checkOne(userId, id);
  }

  @Get()
  async getAll(@GetCurrentUserId() userId: string) {
    return this.favoritesService.getAll(userId);
  }

  @Post()
  async toggleOne(@GetCurrentUserId() userId: string, @Body('id') id: number) {
    return this.favoritesService.toggleOne(userId, id);
  }
}
