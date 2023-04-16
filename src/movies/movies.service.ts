import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileType, FilesService } from 'src/files/files.service';
import { Movie } from './movie.model';
import { Files } from './files.interface';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    private filesService: FilesService,
  ) {}

  async create(dto: Movie, files: Files): Promise<Movie> {
    const isExist = await this.findById(dto.id);

    if (isExist) {
      throw new HttpException(
        { message: 'Фильм с таким ID уже существует' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const videoPath = this.filesService.createFile(
      FileType.VIDEO,
      files.trailer,
    );
    const imagePath = this.filesService.createFile(FileType.IMAGE, files.image);
    const track = await this.movieModel.create({
      ...dto,
      trailer: videoPath,
      picture: imagePath,
    });
    return track;
  }

  async getAll(): Promise<Movie[]> {
    const allMovies = await this.movieModel.find().exec();
    return allMovies;
  }

  private async findById(id: number): Promise<Movie> {
    return this.movieModel.findOne({ id }).exec();
  }
}
