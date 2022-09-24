import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Tag, TagDocument } from './entities/tag.entity'
import { ConnectProfileDto } from './dto/connect.dto'

@Injectable()
export class TagService {
	constructor(
		@InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>
	) {}

	async create(createTagDto: CreateTagDto): Promise<string> {
		const tag = await this.tagModel.create(createTagDto)
		return String(tag._id)
	}

	findAll() {
		return this.tagModel
			.find()
			.populate([
				{
					path: 'profiles',
					select: '_id countOpened',
					options: {
						sort: {
							countOpened: 'desc',
						},
					},
				},
			])
			.select('-updatedAt -__v')
			.sort({ profiles: -1 })
			.exec()
	}

	findOne(id: string) {
		return this.tagModel.findById(id)
	}

	findByName(name: string) {
		return this.tagModel.findOne({name}).populate([
				{
					path: 'profiles',
					select: '-__v -updatedAt',
					options: {
						sort: {
							countOpened: 'desc',
						},
					},
          populate:[{
          path:'link'
        }]
				},
			])
			.select('-updatedAt -__v')
			.sort({ profiles: -1 })
			.exec()	
  }

	update(id: string, updateTagDto: UpdateTagDto) {
		return this.tagModel.findByIdAndUpdate(id, updateTagDto)
	}

	async addProfileToTag({ tagId, profileId }: ConnectProfileDto) {
		const tag = await this.tagModel.findOne({
			_id: tagId,
			profiles: { $in: new Types.ObjectId(profileId) },
		})

		if (Boolean(tag?.name))
			throw new BadRequestException('This profile already added')

		return this.tagModel
			.findByIdAndUpdate(
				tagId,
				{ $push: { profiles: profileId } },
				{ new: true }
			)
			.exec()
	}

	async removeProfileFromTag({ tagId, profileId }: ConnectProfileDto) {
		return this.tagModel
			.findByIdAndUpdate(
				tagId,
				{ $pull: { profiles: profileId } },
				{ new: true }
			)
			.exec()
	}

	remove(id: string) {
		return this.tagModel.findByIdAndDelete(id)
	}
}
