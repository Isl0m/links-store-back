import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Transform } from 'class-transformer'
import { Document } from 'mongoose'

export type LinkDocument = Link & Document


@Schema()
export class Link {
	@Transform(({ value }) => value.toString())
	_id: string

	@Prop({ default: [] })
	social: string[]

	@Prop({ default: '/uploads/default/bg1.png' })
	background: string

	@Prop({ required: false })
	portfolio: string[]

	@Prop({ required: false })
	avatar: string

	@Prop({ required: false })
	CV: string
}

export const LinkSchema = SchemaFactory.createForClass(Link)
