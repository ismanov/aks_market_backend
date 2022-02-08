import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class CreateVerificationDto {
  @MaxLength(60)
  @IsNotEmpty()
  readonly code: number;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly phone: string;
}
