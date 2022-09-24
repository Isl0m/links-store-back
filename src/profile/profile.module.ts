import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Profile, ProfileSchema } from './entities/profile.entity'
import {UserModule} from 'src/user/user.module'
import { TagModule } from 'src/tag/tag.module'
import { DetailModule } from 'src/detail/detail.module'
import { LinkModule } from 'src/link/link.module'

@Module({
	imports: [
    UserModule,
		DetailModule,
		LinkModule,
		TagModule,
		MongooseModule.forFeatureAsync([
			{ name: Profile.name, useFactory: () => ProfileSchema },
		]),
	],
	controllers: [ProfileController],
	providers: [ProfileService],
	exports: [ProfileService],
})
export class ProfileModule {}
