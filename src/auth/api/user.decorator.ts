import { createParamDecorator, ExecutionContext } from "@nestjs/common";

interface User {
  id: string,
  role: string
}

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  return req.user as User
})
