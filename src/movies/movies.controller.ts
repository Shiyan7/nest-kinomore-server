import { Controller, Get, Post, Body } from '@nestjs/common';
import { Movie } from './movie.model';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  async create(@Body() dto: Movie) {
    return this.moviesService.create(dto);
  }

  @Get()
  findAll(): Promise<Movie[]> {
    return this.moviesService.getAll();
  }
}
