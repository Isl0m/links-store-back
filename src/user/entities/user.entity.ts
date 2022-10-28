import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Transform } from 'class-transformer'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Profile } from '../../profile/entities/profile.entity'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
	@Transform(({ value }) => value.toString())
	_id: string

	@Prop({ unique: true })
	email: string

	@Prop()
	password: string

	@Prop({ default: false })
	isAdmin: boolean

	@Prop({
		required: false,
		type: MongooseSchema.Types.ObjectId,
		ref: Profile.name,
	})
	profile: Profile
}

export const UserSchema = SchemaFactory.createForClass(User)
