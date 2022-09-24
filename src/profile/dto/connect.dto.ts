import { IsString } from 'class-validator'

export class ConnectTagDto {
	@IsString()
	profileId: string

	@IsString()
	tagId: string
}
