import { Length } from 'class-validator';

export class TicketDto {
  @Length(3, 100, { message: 'Le titre doit faire entre 3 et 100 charactères' })
  public title: string;

  @Length(3, 1000, {
    message: 'La description doit faire entre 3 et 1000 charactères',
  })
  public description: string;

  @Length(3, 1000, {
    message: 'La réponse doit faire entre 3 et 1000 charactères',
  })
  public response: string;
}
