import { Module } from '@nestjs/common'
import { DetailService } from './detail.service'
import { DetailController } from './detail.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Detail, DetailSchema } from './entities/detail.entity'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{ name: Detail.name, useFactory: () => DetailSchema },
		]),
	],
	controllers: [DetailController],
	providers: [DetailService],
	exports: [DetailService],
})
export class DetailModule {}
