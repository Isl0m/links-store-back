import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CreateDetailDto } from './dto/create-detail.dto'
import { UpdateDetailDto } from './dto/update-detail.dto'
import { Detail, DetailDocument } from './entities/detail.entity'

@Injectable()
export class DetailService {
	constructor(
		@InjectModel(Detail.name)
		private readonly detailModel: Model<DetailDocument>
	) {}
	async create(createDetailDto: CreateDetailDto) {
		const detail = await this.detailModel.create(createDetailDto)
		return detail._id
	}

	findAll() {
		return this.detailModel.find().exec()
	}

	async findWithFilter(filterOptions: any) {
		const profileIds = await this.detailModel
			.find(filterOptions)
			.select('profileId ')
			.exec()
		return profileIds.map(item => item.profileId)
	}

	findOne(id: string) {
		return this.detailModel.findById(id)
	}

	update(id: string, updateDetailDto: UpdateDetailDto) {
		return this.detailModel.findByIdAndUpdate(id, updateDetailDto)
	}

	remove(id: string) {
		return this.detailModel.findByIdAndDelete(id)
	}
}
