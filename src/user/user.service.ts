import { Injectable, NotFoundException } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './entities/user.entity'
import { genSalt, hash } from 'bcryptjs'
@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>
	) {}

	findAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i'),
					},
					{
						name: new RegExp(searchTerm, 'i'),
					},
				],
			}

		return this.userModel
			.find(options)
			.select('-password -updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.exec()
	}

	findOne(id: string) {
		return this.userModel.findById(id)
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.findOne(id)
		const isSameUser = await this.userModel.findOne({
			email: updateUserDto.email,
		})

		if (isSameUser && String(id) !== String(isSameUser._id))
			throw new NotFoundException('Email busy')
		if (updateUserDto.password) {
			const salt = await genSalt(12)
			user.password = await hash(updateUserDto.password, salt)
		}

		user.email = updateUserDto.email
		

		if (updateUserDto.isAdmin || updateUserDto.isAdmin === false) {
			user.isAdmin = updateUserDto.isAdmin
		}

		await user.save()

		return user
	}

	remove(id: string) {
		return this.userModel.findByIdAndDelete(id)
	}

	getCount() {
		return this.userModel.find().count().exec()
	}
}
