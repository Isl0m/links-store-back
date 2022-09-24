import {
	Controller,
	Get,
	Post,
	Body,
	Put,
	Param,
	Delete,
	Query,
} from '@nestjs/common'
import {Types} from 'mongoose'
import { ProfileService } from './profile.service'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ConnectTagDto } from './dto/connect.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorator'

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get()
	findAll(@Query('searchTerm') searchTerm: string) {
		return this.profileService.findAll(searchTerm)
	}
	
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.profileService.findOne(id)
	}

	@Post('most-popular')
	findMostPopular() {
		return this.profileService.findMostPopular()
	}

	@Post('with-filter')
	findWithFilter(@Body() filterOptions: any) {
		return this.profileService.findWithFilter(filterOptions)
	}

	@Post()
	create(@Body() createProfileDto: CreateProfileDto) {
		return this.profileService.create(createProfileDto)
	}

	@Post('connect-tag')
	connectTag(@Body() dto: ConnectTagDto) {
		return this.profileService.connectTag(dto)
	}
	
  @Put('inc-count-opened/:id')
	incCountOpened(@Param('id') id: string) {
		return this.profileService.incCountOpened(id)
	}
	
  // Only User
	
  @Post('by-user')
	@Auth('user')
	findByUser(@User('_id') _id:Types.ObjectId) {
		const userId = String(_id)
		return this.profileService.findByUser(userId)
	}

	@Put()
	@Auth('user')
	update(
		@User('profile') profileId: string,
		@Body() updateProfileDto: UpdateProfileDto
	) {
		return this.profileService.update(profileId, updateProfileDto)
	}

	

	// Only Admin

	@Delete(':id')
	@Auth('admin')
	remove(@Param('id') id: string) {
		return this.profileService.remove(id)
	}
}
