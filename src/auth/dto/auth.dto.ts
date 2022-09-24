import { IsEmail, IsString, MinLength } from 'class-validator'

export class RegisterDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, {
		message: 'Password cannot be less than 6 characters',
	})
	password: string

	@IsString()
	name: string

	@IsString()
	profession: string

	surname?: string
}

export class LoginDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, {
		message: 'Password cannot be less than 6 characters',
	})
	password: string
}
