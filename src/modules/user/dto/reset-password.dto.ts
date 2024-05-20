import { IsString, IsStrongPassword } from "class-validator";

export class ResetPasswordDTO {
    @IsString()
    id: string; 

    @IsString()
    @IsStrongPassword()
    password: string;
}


