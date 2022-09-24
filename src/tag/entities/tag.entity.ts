import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Transform } from 'class-transformer'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Profile } from 'src/profile/entities/profile.entity'

export type TagDocument = Tag & Document

@Schema()
export class Tag {
	@Transform(({ value }) => value.toString())
	_id: string

	@Prop()
	name: string

	@Prop({
		required: false,
		type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Profile' }],
	})
	profiles: Profile[]
}

export const TagSchema = SchemaFactory.createForClass(Tag)
