import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const ParseToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    return req.token;
})