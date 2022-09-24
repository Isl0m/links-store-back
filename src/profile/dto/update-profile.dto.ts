import { IsString } from 'class-validator';
import { CreateDetailDto } from 'src/detail/dto/create-detail.dto';
import { CreateLinkDto } from 'src/link/dto/create-link.dto';
import { CreateTagDto } from 'src/tag/dto/create-tag.dto';

export class UpdateProfileDto  {
  profile:ProfileDto

  user?:UserDto

	link?: CreateLinkDto

	detail?: CreateDetailDto

	tags?: CreateTagDto[]
}

class ProfileDto {
  @IsString()
  name: string

	@IsString()
	profession: string

	countOpened?: number

	surname?: string
}

class UserDto {
  @IsString()
  email: string

	password?: string
}