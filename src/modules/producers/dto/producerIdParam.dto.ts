import { Matches } from 'class-validator';

export class ProducerIdParam {
  @Matches(/^[0-9]+$/, {
    message: 'O identificador único do produtor não é de um tipo válido.',
  })
  readonly producerId: string;
}
