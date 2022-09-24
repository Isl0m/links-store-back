import {  IsString} from 'class-validator'

export class CreateTagDto {
	@IsString()
	name: string

	profiles?: string[]
}
