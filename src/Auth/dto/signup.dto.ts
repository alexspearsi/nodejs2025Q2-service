import { IsString, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
