import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './movie.model';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async create(dto: Movie): Promise<MovieDocument> {
    const isExist = await this.findById(dto.id);

    if (isExist) {
      throw new HttpException(
        { message: 'Фильм с таким ID уже существует' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const movie = await this.movieModel.create(dto);

    return movie;
  }

  async getAll(): Promise<MovieDocument[]> {
    const allMovies = await this.movieModel.find().exec();
    return allMovies;
  }

  private async findById(id: number): Promise<MovieDocument> {
    return this.movieModel.findOne({ id }).exec();
  }
}
