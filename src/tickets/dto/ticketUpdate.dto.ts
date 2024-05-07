import { Length } from 'class-validator';

export class TicketUpdateDto {
  @Length(3, 1000, {
    message: 'La réponse doit faire entre 3 et 1000 charactères',
  })
  public response: string;
}
