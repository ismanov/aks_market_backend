import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class CreateVerificationDto {
  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  readonly code: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly phone: string;
}
