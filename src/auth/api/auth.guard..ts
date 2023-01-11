import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  LoggerService
} from "@nestjs/common";
import {Request} from 'express';
import {TokenRepository} from "../domain/token.repository";
import {AuthRepository} from "../domain/auth.repository";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
      @Inject('TokenRepository')
      private readonly tokenRepository: TokenRepository,
      @Inject('AuthRepository')
      private readonly authRepository: AuthRepository,
      @Inject('LoggerService')
      private readonly logger: LoggerService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    const token = (authorization || "").split(" ")[1];
    if(!token) {
      return false
    }
    try {
      const entity = await this.tokenRepository.getByToken<{ role: string, id: string }>(token);
      const { id, role } = entity.getData();
      await this.authRepository.getById(id);
      request.user = { id, role };
      (request as any).token = token;
      await this.tokenRepository.touch(token);
      return true;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return false;
    }
  }

}
