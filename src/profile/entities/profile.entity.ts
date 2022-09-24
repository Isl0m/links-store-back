import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Transform } from 'class-transformer'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Detail } from 'src/detail/entities/detail.entity'
import { Link } from 'src/link/entities/link.entity'
import { Tag } from 'src/tag/entities/tag.entity'

export type ProfileDocument = Profile & Document

@Schema({ timestamps: true })
export class Profile {
	@Transform(({ value }) => value.toString())
	_id: string

	@Prop()
	name: string

	@Prop({ required: false })
	surname: string

	@Prop()
	profession: string

	@Prop({ default: 0 })
	countOpened: number

	@Prop({
		required: false,
		type: MongooseSchema.Types.ObjectId,
		ref: Detail.name,
	})
	detail: Detail

	@Prop({
		required: false,
		type: MongooseSchema.Types.ObjectId,
		ref: Link.name,
	})
	link: Link

	@Prop({
		required: false,
		type: [{ type: MongooseSchema.Types.ObjectId, ref: Tag.name }],
	})
	tags: Tag[]
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)
