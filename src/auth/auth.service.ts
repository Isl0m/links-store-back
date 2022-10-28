import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { compare, genSalt, hash } from 'bcryptjs'
import { User, UserDocument } from '../user/entities/user.entity'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import { ProfileService } from '../profile/profile.service'
import { omit } from 'lodash'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
		private readonly profileService: ProfileService,
		private readonly jwtService: JwtService
	) {}

	async register(dto: RegisterDto) {
		const oldUser = await this.userModel.findOne({ email: dto.email })

		if (oldUser)
			throw new BadRequestException(
				'User with this email is already in the system'
			)

		const salt = await genSalt(12)

		const profile = await this.profileService.create(
			omit(dto, ['email', 'password'])
		)

		const newUser = new this.userModel({
			email: dto.email,
			password: await hash(dto.password, salt),
			profile: profile._id,
		})

		const tokens = await this.issueTokenPair(String(newUser._id))

		const user = await newUser.save()

		return {
			user: {...this.returnUserFields(user),
				name:dto.name,
				profession:dto.profession,
				surname:dto.surname,
        profileId: user.profile
			},
			...tokens,
		}
	}

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto)

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: {...this.returnUserFields(user),
				name:user.profile.name,
				profession:user.profile.profession,
				surname:user.profile.surname,
        profileId:user.profile._id

			},
			...tokens,
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) throw new UnauthorizedException('Please sign in')

		const result = await this.jwtService.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid token or expired')

		const user = await this.userModel.findById(result._id).populate([{path:'profile',select:'_id name profession surname'}])

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: {...this.returnUserFields(user),
				name:user.profile.name,
				profession:user.profile.profession,
				surname:user.profile.surname,
        profileId:user.profile._id
			},
			...tokens,
		}
	}

	async validateUser(dto: LoginDto): Promise<UserDocument> {
		const user = await this.userModel.findOne({ email: dto.email }).populate([{path:'profile',select:'_id name profession surname'}])

		if (!user) throw new UnauthorizedException('User not found')

		const isValidPassword = await compare(dto.password, user.password)
		if (!isValidPassword) throw new UnauthorizedException('Invalid password')

		return user
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		})

		return { refreshToken, accessToken }
	}

	returnUserFields(user: UserDocument) {
		return {
			_id: user._id,
			email: user.email
		}
	}
}
