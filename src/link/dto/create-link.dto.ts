import { IsArray } from 'class-validator'

export class CreateLinkDto {
	@IsArray()
	social: string[]

	background?: string

	portfolio?: string[]

	avatar?: string

	CV?: string
}
