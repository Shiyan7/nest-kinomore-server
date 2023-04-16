import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Movie } from './movie.model';
import { MoviesService } from './movies.service';
import { Files } from './files.interface';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: Files,
    @Body() dto: Movie,
  ) {
    const { trailer, image } = files;

    return this.moviesService.create(dto, {
      trailer: trailer[0],
      image: image[0],
    });
  }

  @Get()
  findAll(): Promise<Movie[]> {
    return this.moviesService.getAll();
  }
}
