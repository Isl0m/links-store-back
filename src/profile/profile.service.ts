import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { UserService } from 'src/user/user.service'
import { DetailService } from 'src/detail/detail.service'
import { LinkService } from 'src/link/link.service'
import { TagService } from 'src/tag/tag.service'
import { ConnectTagDto } from './dto/connect.dto'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { Profile, ProfileDocument } from './entities/profile.entity'
import { difference } from 'lodash'

@Injectable()
export class ProfileService {
	constructor(
		@InjectModel(Profile.name)
		private readonly profileModel: Model<ProfileDocument>,
    private readonly userService: UserService,
		private readonly detailService: DetailService,
		private readonly linkService: LinkService,
		private readonly tagService: TagService
	) {}

	create(createProfileDto: CreateProfileDto) {
		return this.profileModel.create(createProfileDto)
	}

	async connectTag({ profileId, tagId }: ConnectTagDto) {
		await this.tagService.addProfileToTag({ profileId, tagId })
		return this.addTagToProfile(profileId, tagId)
	}

	async disconnectTag({ profileId, tagId }: ConnectTagDto) {
		await this.tagService.removeProfileFromTag({ profileId, tagId })
		return this.removeTagFromProfile(profileId, tagId)
	}

	async addTagToProfile(profileId: string, tagId: string) {
		const profile = await this.profileModel.findOne({
			_id: profileId,
			tags: { $in: new Types.ObjectId(tagId) },
		})

		if (Boolean(profile?._id))
			throw new BadRequestException('This tag already added')

		return this.profileModel
			.findByIdAndUpdate(profileId, { $push: { tags: tagId } }, { new: true })
			.exec()
	}

	async removeTagFromProfile(profileId: string, tagId: string) {

		return this.profileModel
			.findByIdAndUpdate(profileId, { $pull: { tags: tagId } }, { new: true })
			.exec()
	}

	findAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						profession: new RegExp(searchTerm, 'i'),
					},
					{
						surname: new RegExp(searchTerm, 'i'),
					},
				],
			}

		return this.profileModel
			.find(options)
			.populate([
				{
					path: 'tags',
					select: '_id name',
					options: {
						sort: {
							profiles: -1,
						},
					},
				},
				{
					path: 'link',
					select: '-__v',
				},
				{
					path: 'detail',
					select: '-__v',
				},
			])
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.exec()
	}

	findOne(id: string) {
		 return this.profileModel.findById(id).populate([
				{
					path: 'tags',
					select: '_id name',
					options: {
						sort: {
							profiles: -1,
						},
					},
				},
				{
					path: 'link',
					select: '-__v',
				},
				{
					path: 'detail',
					select: '-__v',
				},
			]).select('-updatedAt -__v')
	}

  async findByUser(userId:string){
    const user = await this.userService.findOne(userId)
    return this.findOne(String(user.profile))
  }

	findMostPopular() {
		return this.profileModel
			.find()
			.populate([
				{
					path: 'link',
					select: 'avatar background',
				},
        {
          path: 'tags',
          select: 'name'
        }
			])
			.select('-updatedAt -__v')
			.sort({
				countOpened: 'desc',
			})
			.exec()
	}

	async findWithFilter(filterOptions: any) {
		const profileIds = await this.detailService.findWithFilter(filterOptions)
		return this.profileModel
			.find({ _id: { $in: profileIds } })
			.populate([
				{
					path: 'link',
					select: 'avatar',
				},
			])
			.select('-updatedAt -__v')
			.sort({
				countOpened: 'desc',
			})
			.exec()
	}

	incCountOpened(id: string) {
		return this.profileModel.findByIdAndUpdate(id, { $inc: { countOpened: 1 } })
	}

	async update(profileId: string, updateProfileDto: UpdateProfileDto) {
		const { profile,detail,link,tags,user } = updateProfileDto
		const oldProfile = await this.profileModel
			.findById(profileId)
			.populate([
				{
					path: 'tags',
					select: '_id name',
				},
			])
			.exec()
		
		if(user){
			// await this.userService.update()
		}

		if (detail && oldProfile.detail){
			await this.detailService.update(String(oldProfile.detail), detail)
	}else {
			const detailId = await this.detailService.create({
				...detail,
				profileId: profileId,
			})
			await this.profileModel.findByIdAndUpdate(profileId, { detail:detailId })
		}
		if (link && oldProfile.link)
			await this.linkService.update(String(oldProfile.link), link)
		else {
			const linkId = await this.linkService.create(link)
			await this.profileModel.findByIdAndUpdate(profileId, { link:linkId })
		}
		if (tags) {
			const oldTags =  oldProfile.tags.map(item=>item.name)
			const newTags = Boolean(tags[0].name) ? tags.map(item=>item.name):tags
			
			
			const removedTags = difference(oldTags, newTags, 'name')
			const addedTags = difference(newTags, oldTags, 'name')

			if (removedTags) {
				removedTags.forEach(async tag => {
          const findTag = await this.tagService.findByName(tag)
					await this.disconnectTag({
						profileId: String(profileId),
						tagId: String(findTag._id),
					})
				})
			}
			if (addedTags) {
				addedTags.forEach(async addedTag => {
					const findTag = await this.tagService.findByName(addedTag)
					const tag = { _id: findTag?._id || '' }
					if (!findTag) {
						tag._id = await this.tagService.create({name:addedTag})
					}
					await this.connectTag({
						profileId: String(profileId),
						tagId: tag._id,
					})
				})
			}
		}

		const isProfileChanged = oldProfile.name !== profile.name || oldProfile.profession !== profile.profession || oldProfile.surname !== profile.surname || profile.surname 
		
		if(isProfileChanged){
			oldProfile.name = profile.name
			oldProfile.profession = profile.profession
			oldProfile.surname = profile.surname 
		}
		return oldProfile.save()
	}

	remove(id: string) {
		return this.profileModel.findByIdAndRemove(id)
	}

	// Utils

	async createTags(array, profileId) {
		if (array) {
			array.forEach(async item => {
				const tagId = await this.tagService.create({name:item})
				await this.connectTag({
					profileId: String(profileId),
					tagId: tagId,
				})
			})
		}
	}
}
