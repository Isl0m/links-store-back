import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/user/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from '../../src/config/jwt.config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { ProfileModule } from '../../src/profile/profile.module'

@Module({
	imports: [
		ProfileModule,
		ConfigModule,
		MongooseModule.forFeatureAsync([
			{ name: User.name, useFactory: () => UserSchema },
		]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
