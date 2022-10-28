import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Profile, ProfileSchema } from './entities/profile.entity'
import {UserModule} from '../user/user.module'
import { TagModule } from '../tag/tag.module'
import { DetailModule } from '../detail/detail.module'
import { LinkModule } from '../link/link.module'

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
