import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly adminEmail = 'admin@consoltech.com';
  private readonly adminPassword = 'Admin123!';

  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    if (email !== this.adminEmail || password !== this.adminPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email, role: 'Admin' };
    const access_token = this.jwtService.sign(payload, { expiresIn: '8h' });

    return {
      access_token,
      expires_in: 28800, // 8 hours in seconds
    };
  }
}
