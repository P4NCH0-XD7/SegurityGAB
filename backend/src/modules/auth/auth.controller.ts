// ===========================================
// Auth Controller
// ===========================================
// Handles HTTP routes for authentication:
// POST /auth/login, POST /auth/register,
// POST /auth/forgot-password, POST /auth/reset-password

import { Controller } from '@nestjs/common';
// import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    // constructor(private readonly authService: AuthService) {}

    // @Post('login')
    // async login(@Body() loginDto: LoginDto) {}

    // @Post('register')
    // async register(@Body() registerDto: RegisterDto) {}

    // @Post('forgot-password')
    // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {}

    // @Post('reset-password')
    // async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {}

    // @Post('refresh-token')
    // async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {}
}
