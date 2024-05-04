import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class AuthSignupDto {
  @IsEmail()
  public email: string;

  @Length(3, 20, { message: 'Username has to be at between 3 and 20 chars' })
  public username: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be at between 3 and 20 chars' })
  public password: string;
}

export class AuthSigninDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Le mot de passe doit faire minimum 3 caractères' })
  public password: string;
}
