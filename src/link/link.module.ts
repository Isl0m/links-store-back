import { Module } from '@nestjs/common'
import { LinkService } from './link.service'
import { LinkController } from './link.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Link, LinkSchema } from './entities/link.entity'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{ name: Link.name, useFactory: () => LinkSchema },
		]),
	],
	controllers: [LinkController],
	providers: [LinkService],
	exports: [LinkService],
})
export class LinkModule {}
