import {AuthCredentials} from "./authCredentials";
import {LoginData} from "./loginData";
import {SetPasswordData} from "./setPasswordData";

export interface AuthService {
    login(credentials: AuthCredentials): Promise<LoginData>;
    setPasswordByUserId(userId: string, password: SetPasswordData): Promise<boolean>;
    setPassword(token: string, password: SetPasswordData): Promise<boolean>;
    resetPassword(email: string): Promise<boolean>;
}