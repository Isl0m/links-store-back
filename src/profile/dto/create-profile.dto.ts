import {  IsString } from 'class-validator'

export class CreateProfileDto {
	@IsString()
	name: string

	@IsString()
	profession: string

	surname?: string

}
