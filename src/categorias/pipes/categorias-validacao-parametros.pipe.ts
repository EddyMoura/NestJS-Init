import {
  ArgumentMetadata,
  BadRequestException,
  Logger,
  PipeTransform,
} from '@nestjs/common';

export class CategoriasValidacaoParametrosPipe implements PipeTransform {
  private readonly logger = new Logger(CategoriasValidacaoParametrosPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(
        `O valor do parametro ${metadata.data} deve ser informado`,
      );
    }

    this.logger.log(`value: ${value} metadata: ${metadata.type}`);

    return value;
  }
}
