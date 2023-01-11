import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private readonly role: string
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: any = context.switchToHttp().getRequest();
        if(request.user.role !== this.role) {
            return false;
        }
        return true;
    }

}