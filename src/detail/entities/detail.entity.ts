import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Transform } from 'class-transformer'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Profile } from 'src/profile/entities/profile.entity'

export type DetailDocument = Detail & Document



@Schema()
export class Detail {
	@Transform(({ value }) => value.toString())
	_id: string

	@Prop()
	age: number

	@Prop()
	gender: string

	@Prop()
	country: string

	@Prop()
	biography: string

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'Profile',
	})
	profileId: Profile

	// Optional

	@Prop({ required: false })
	birthDay: string

	@Prop({ required: false })
	city: string
}

export const DetailSchema = SchemaFactory.createForClass(Detail)
