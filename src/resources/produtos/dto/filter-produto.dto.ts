import { Type, Transform } from 'class-transformer';
import { IsOptional, IsInt, IsString, IsNumber, Length } from 'class-validator';

export class FilterProdutoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O campo codigo deve ser um inteiro' })
  codigo?: number;

  @IsOptional()
  @IsString()
  @Length(3, 60, {
    message: 'O campo descrição precisa ter entre 3 e 60 caracteres',
  })
  descricao?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'O campo custo deve ser um número decimal com duas casas decimais',
    },
  )
  custo?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'O campo precoVenda deve ser um número decimal com duas casas decimais',
    },
  )
  precoVenda?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page = 1;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit = 5;
}
