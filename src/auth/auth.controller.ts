import { Controller, Body, Post, Query, Get } from "@nestjs/common";
import { AuthService, IUser } from "./auth.service";
import { RegisterAuthDto } from "./dto/create-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
  ): Promise<string | IUser> {
    return await this.authService.register(registerAuthDto);
  }

  @Get("email/verify")
  verify(@Query("emailVireficationToken") emailVireficationToken: string) {
    console.log(emailVireficationToken);

    this.authService.verify(emailVireficationToken);
    return emailVireficationToken;
  }
}
