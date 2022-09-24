import { IsNumber,  IsString } from 'class-validator'

export class CreateDetailDto {
	@IsNumber()
	age: number

	@IsString()
	gender: string

	@IsString()
	country: string

	@IsString()
	biography: string

	@IsString()
	profileId: string

	// Optional

	birthDay?: string

	city?: string
}
