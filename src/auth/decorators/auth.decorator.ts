import { applyDecorators, UseGuards } from '@nestjs/common'
import { OnlyAdminsGuard } from '../guards/admin.guard'
import { JwtAuthGuard } from '../guards/jwt.guard'

type TypeRole = 'user' | 'admin'

export const Auth = (role: TypeRole = 'user') =>
	applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, OnlyAdminsGuard)
			: UseGuards(JwtAuthGuard)
	)
