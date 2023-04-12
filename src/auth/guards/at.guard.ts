import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { ExecutionContext } from '@nestjs/common/interfaces'
import { Injectable } from '@nestjs/common/decorators'

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getClass(), context.getHandler()])

    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }
}
