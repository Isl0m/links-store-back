import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { User } from '../../user/entities/user.entity'

export class OnlyAdminsGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<{ user: User }>()
		const user = request.user

		if (!user.isAdmin) throw new ForbiddenException('You have no rights')

		return user.isAdmin
	}
}
