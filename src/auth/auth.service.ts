import { Injectable } from "@nestjs/common";
import { RegisterAuthDto } from "./dto/create-auth.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";

export interface IUser {
  email: string;
  password: string;
  isActive?: boolean;
}

const users = new Map<string, IUser>();

const verificationTokens = new Map<string, string>();

@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto): Promise<IUser | string> {
    const user = users.get(registerAuthDto.email);

    if (user) {
      return `this user alaredy exist`;
    }

    users.set(registerAuthDto.email, { ...registerAuthDto, isActive: false });

    const emailVireficationToken: string = this.jwtService.sign({
      sub: registerAuthDto.email,
    }) as string;

    verificationTokens.set(emailVireficationToken, registerAuthDto.email);

    const emailVireficationTokenUrl = `http://localhost:3000/auth/email/verify?emailVireficationToken=${emailVireficationToken}`;

    await this.mailerService.sendMail({
      to: registerAuthDto.email,
      subject: "Testing Nest MailerModule ✔",
      html: `<b>welcome</b>   <br>   <a href=${emailVireficationTokenUrl}>verify</a>`,
    });
    console.log(users.entries());
    return registerAuthDto;
  }

  verify(verificationToken) {
    const email: string = verificationTokens.get(verificationToken);

    if (!email) {
      return `this token not founded`;
    }

    const user = users.get(email);
    users.delete(email);

    users.set(email, { ...user, isActive: true });

    console.log(users.entries());
    verificationTokens.delete(verificationToken);
    return `Verifed`;
  }
}
