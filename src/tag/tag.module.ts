import { Module } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagController } from './tag.controller'
import { Tag, TagSchema } from './entities/tag.entity'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{ name: Tag.name, useFactory: () => TagSchema },
		]),
	],
	controllers: [TagController],
	providers: [TagService],
	exports: [TagService],
})
export class TagModule {}
