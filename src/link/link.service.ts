import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CreateLinkDto } from './dto/create-link.dto'
import { UpdateLinkDto } from './dto/update-link.dto'
import { Link, LinkDocument } from './entities/link.entity'

@Injectable()
export class LinkService {
	constructor(
		@InjectModel(Link.name) private readonly linkModel: Model<LinkDocument>
	) {}
	async create(createLinkDto: CreateLinkDto) {
		const link = await this.linkModel.create(createLinkDto)
		return link._id
	}

	findAll() {
		return this.linkModel.find().exec()
	}

	findOne(id: string) {
		return this.linkModel.findById(id)
	}

	update(id: string, updateLinkDto: UpdateLinkDto) {
		return this.linkModel.findByIdAndUpdate(id, updateLinkDto)
	}

	remove(id: string) {
		return this.linkModel.findByIdAndDelete(id)
	}
}
