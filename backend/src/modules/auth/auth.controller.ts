import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { FallbackDbService } from '../../config/fallback-db.service';
import { DatabaseService } from '../../config/database.service';

@Controller()
export class AuthController {
  constructor(
    private readonly fallbackDbService: FallbackDbService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Post('auth/login')
  async login(
    @Body()
    body: {
      email?: string;
      password?: string;
      role?: string;
      hospitalCode?: string;
    },
  ) {
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const hospitalCode = body.hospitalCode?.trim().toUpperCase();

    if (!email || !password) {
      throw new HttpException(
        { message: 'Email and password are required.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    let user: any = null;

    // 1. Try the real PostgreSQL database first
    try {
      const rows = await this.databaseService.query(
        'SELECT * FROM users WHERE LOWER(email) = $1',
        [email],
      );
      if (rows.length > 0) {
        user = rows[0];
      }
    } catch {
      // DB not available — fall through to fallback
    }

    // 2. Fall back to the JSON file database
    if (!user) {
      const allUsers = this.fallbackDbService.getUsers();
      user = allUsers.find(
        (u: any) => u.email.trim().toLowerCase() === email,
      );
    }

    // 3. No user found at all
    if (!user) {
      throw new HttpException(
        { message: 'No account found with this email address.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 4. Check password (plain text for now — hash later with bcrypt)
    const storedPassword = user.password || user.password_hash;
    if (storedPassword !== password) {
      throw new HttpException(
        { message: 'Incorrect password. Please try again.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 5. Check hospital code if provided
    const userHospitalCode = user.hospitalCode || user.hospital_code;
    if (hospitalCode && userHospitalCode && userHospitalCode !== hospitalCode) {
      throw new HttpException(
        { message: 'This account does not belong to the selected hospital.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 6. Success — return user info and a token
    return {
      token: `pulsegrid-token-${user.id || user.email}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hospitalCode: userHospitalCode,
        specialtyOrDepartment:
          user.specialtyOrDepartment || user.specialty_or_department || null,
      },
    };
  }
}