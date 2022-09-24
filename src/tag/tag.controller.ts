import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common'
import { TagService } from './tag.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { ConnectProfileDto } from './dto/connect.dto'

@Controller('tag')
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@Post()
	create(@Body() createTagDto: CreateTagDto) {
		return this.tagService.create(createTagDto)
	}

	@Post('connect-profile')
	addProfileToTag(@Body() dto: ConnectProfileDto) {
		return this.tagService.addProfileToTag(dto)
	}

	@Get()
	findAll() {
		return this.tagService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.tagService.findOne(id)
	}

  @Get('by-name/:name')
	findByName(@Param('name') name: string) {
		return this.tagService.findByName(name)
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
		return this.tagService.update(id, updateTagDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.tagService.remove(id)
	}
}
