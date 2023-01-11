import {
  Body,
  Controller,
  Inject,
  Patch,
  Post,
  UseFilters,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe, Ip, Header, Headers, LoggerService
} from "@nestjs/common";
import {AuthService} from "../domain/auth.service";
import {LoginDto} from "./login.dto";
import {AuthCredentials} from "../domain/authCredentials";
import {AuthExceptionFilter} from "./auth.exceptionFilter";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {SetPasswordDto} from "./setPassword.dto";
import {PlainPassword} from "../domain/plainPassword";
import {ResetPasswordDto} from "./resetPassword.dto";
import {User} from "./user.decorator";
import {TokenRepository} from "../domain/token.repository";
import {AuthGuard} from "./auth.guard.";
import {ParseToken} from "./parseToken.decorator";

@UseFilters(AuthExceptionFilter)
@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(
      @Inject('AuthService')
      private readonly service: AuthService,
      @Inject('TokenRepository')
      private readonly tokenRepository: TokenRepository,
      @Inject('LoggerService')
      private readonly logger: LoggerService
  ) {}

  @ApiResponse({ status: 201, description: 'Successfully logged!' })
  @ApiBadRequestResponse({ description: 'Invalid login or email!' })
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() { email, password }: LoginDto, @Ip() ip: string) {
    this.logger.log(`Trying to login with ${email} ${password}`);
    const { id, role } = await this.service.login(new AuthCredentials(email, new PlainPassword(password)));
    const token = await this.tokenRepository.createToken({ id, role, ip, type: 'auth' });
    return { id, role, token };
  }

  @ApiResponse({ status: 201, description: 'Successfully logged out!' })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@ParseToken() token: string) {
    await this.tokenRepository.delete(token);
    return true;
  }

  @ApiResponse({ status: 201, description: 'Password has been set!' })
  @ApiBadRequestResponse({ description: 'Invalid login or email!' })
  @UsePipes(new ValidationPipe())
  @Patch('setPassword')
  async setPassword(@Query('token') token: string, @Body() { repeatedPassword, password }: SetPasswordDto) {
    return await this.service.setPassword(token, { repeatedPassword: new PlainPassword(repeatedPassword), password: new PlainPassword(password) });
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Password has been set!' })
  @ApiBadRequestResponse({ description: 'Invalid login or email!' })
  @ApiUnauthorizedResponse()
  @Patch('setPasswordForPersonalAccount')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async setPasswordForPersonalAccount(@Body() { repeatedPassword, password }: SetPasswordDto, @User() { id, role }) {
    return await this.service.setPasswordByUserId(id, { repeatedPassword: new PlainPassword(repeatedPassword), password: new PlainPassword(password) });
  }

  @ApiResponse({ status: 201, description: 'Request for resetting password has been sent!' })
  @ApiBadRequestResponse({ description: 'Invalid login or email!' })
  @UsePipes(new ValidationPipe())
  @Post('resetPassword')
  async resetPassword(@Body() { email }: ResetPasswordDto) {
    await this.service.resetPassword(email);
    return true;
  }

}
