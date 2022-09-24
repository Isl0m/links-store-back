import { IsString } from 'class-validator'

export class ConnectProfileDto {
	@IsString()
	profileId: string

	@IsString()
	tagId: string
}
