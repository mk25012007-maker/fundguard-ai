import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class GetQuoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9._-]+$/, {
    message:
      'symbol may only contain letters, numbers, dots, underscores, and hyphens',
  })
  symbol!: string;
}
