import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmVerificationDto {
  @MaxLength(60)
  @IsNotEmpty()
  readonly code: number;

  @IsString()
  @IsNotEmpty()
  readonly verificationId: string;
}
