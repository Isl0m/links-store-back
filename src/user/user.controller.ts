import {
	Controller,
	Get,
	Body,
	Param,
	Put,
	Delete,
	Query,
	UsePipes,
	ValidationPipe,
	HttpCode,
} from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { Auth } from '../../src/auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { IdValidationPipe } from './pipes/id.validation.pipe'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@Auth('user')
	findUser(@User('_id') _id: string) {
		return this.userService.findOne(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put()
	@HttpCode(200)
	@Auth('user')
	updateUser(@User('_id') _id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(_id, updateUserDto)
	}

	// Admin Place

	@Get('admin')
	@Auth('admin')
	findAll(@Query('searchTerm') searchTerm?: string) {
		return this.userService.findAll(searchTerm)
	}

	@Get('admin/:id')
	@Auth('admin')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id)
	}

	@Get('admin/count')
	@Auth('admin')
	getCount() {
		return this.userService.getCount()
	}

	@UsePipes(new ValidationPipe())
	@Put('admin/:id')
	@HttpCode(200)
	@Auth('admin')
	update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.update(id, dto)
	}

	@Delete('admin/:id')
	@HttpCode(200)
	@Auth('admin')
	remove(@Param('id') id: string) {
		return this.userService.remove(id)
	}
}
