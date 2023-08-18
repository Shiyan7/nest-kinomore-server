import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileType, FilesService } from 'src/files/files.service';
import { Movie, MovieDocument } from './movie.model';
import { Files } from './files.interface';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    private filesService: FilesService,
  ) {}

  async create(dto: Movie, files: Files): Promise<MovieDocument> {
    const isExist = await this.findById(dto.id);

    if (isExist) {
      throw new HttpException(
        { message: 'Фильм с таким ID уже существует' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const trailer = this.filesService.createFile(FileType.VIDEO, files.trailer);
    const image = this.filesService.createFile(FileType.IMAGE, files.image);
    const movie = await this.movieModel.create({
      ...dto,
      trailer,
      image,
    });

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
