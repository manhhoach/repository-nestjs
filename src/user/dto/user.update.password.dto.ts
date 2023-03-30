import { IsString } from 'class-validator';

export class UpdatePasswordUserDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}
