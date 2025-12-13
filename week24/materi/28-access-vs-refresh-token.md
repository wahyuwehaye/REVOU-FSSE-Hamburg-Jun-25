# 🔑 Access Token vs Refresh Token di NestJS

## 📚 Table of Contents
1. [Analogi Sederhana](#analogi-sederhana)
2. [Apa itu Token?](#apa-itu-token)
3. [Perbedaan Access Token dan Refresh Token](#perbedaan-access-token-dan-refresh-token)
4. [Mengapa Perlu 2 Token?](#mengapa-perlu-2-token)
5. [Cara Kerja Step by Step](#cara-kerja-step-by-step)
6. [Implementasi di NestJS](#implementasi-di-nestjs)
7. [Contoh Real World](#contoh-real-world)
8. [Best Practices](#best-practices)

---

## 🎯 Analogi Sederhana

### Analogi Hotel

Bayangkan kamu menginap di hotel:

#### **Access Token = Kartu Kunci Kamar** 🔑
```
┌─────────────────────────────────────┐
│  🔑 KARTU KUNCI KAMAR               │
│  ─────────────────────────────      │
│  Berlaku: 15 menit                  │
│  Akses: Kamar 402                   │
│  Status: Aktif                      │
│                                     │
│  ⏰ Expired setelah 15 menit!      │
│  ❌ Harus minta kartu baru          │
└─────────────────────────────────────┘
```

**Karakteristik:**
- ✅ Dipakai untuk masuk kamar (akses resource)
- ⏰ **Masa berlaku pendek** (15 menit)
- 🔒 Jika hilang, orang lain bisa masuk kamarmu (bahaya!)
- 🔄 Kalau expired, kamu harus turun ke resepsionis

#### **Refresh Token = KTP/Identitas Kamu** 🆔
```
┌─────────────────────────────────────┐
│  🆔 IDENTITAS TAMU                  │
│  ─────────────────────────────────  │
│  Nama: John Doe                     │
│  Check-in: 1 Des 2025               │
│  Check-out: 7 Des 2025              │
│                                     │
│  ⏰ Berlaku 7 hari!                 │
│  🔄 Untuk perpanjang kartu kunci    │
└─────────────────────────────────────┘
```

**Karakteristik:**
- ✅ Dipakai untuk dapat kartu kunci baru
- ⏰ **Masa berlaku panjang** (7 hari)
- 🔒 Disimpan dengan aman (di dompet/database)
- 🔄 Hanya dipakai saat kartu kunci expired

### Alur Lengkapnya:

```
1️⃣ Check-in Hotel (Login)
   ↓
   Kamu dapat 2 hal:
   • Kartu Kunci (Access Token) - 15 menit
   • Identitas Tamu (Refresh Token) - 7 hari

2️⃣ Masuk Kamar (Akses API)
   ↓
   Pakai Kartu Kunci (Access Token)
   ✅ Pintu terbuka!

3️⃣ Kartu Kunci Expired (15 menit kemudian)
   ↓
   ❌ Kartu tidak bisa buka pintu
   
4️⃣ Turun ke Resepsionis (Refresh Endpoint)
   ↓
   Tunjukkan Identitas Tamu (Refresh Token)
   ✅ Dapat Kartu Kunci baru!
   
5️⃣ Repeat step 2-4 sampai check-out
```

---

## 🔐 Apa itu Token?

Token adalah **"tanda pengenal digital"** yang membuktikan:
- Siapa kamu (identitas)
- Apa yang boleh kamu lakukan (hak akses)
- Sampai kapan token ini berlaku (expired time)

### Format JWT (JSON Web Token)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoiam9obkBibG9nLmNvbSIsInJvbGUiOiJBVVRIT1IiLCJpYXQiOjE3NjUyODc3OTEsImV4cCI6MTc2NTI4ODY5MX0.xgJKPcfQ8D5aFBkJgYmmDSYq8jKwfmMKZKJ4akgRAq0

┌────────────┐  ┌──────────────────────┐  ┌─────────────┐
│  HEADER    │  │      PAYLOAD         │  │  SIGNATURE  │
│  (Algoritma│  │   (Data pengguna)    │  │  (Tanda     │
│   & Type)  │  │                      │  │   tangan)   │
└────────────┘  └──────────────────────┘  └─────────────┘
```

Token ini seperti **sertifikat digital** yang bisa dibaca tapi tidak bisa diubah (kecuali tahu secret key).

---

## 📊 Perbedaan Access Token dan Refresh Token

### Tabel Perbandingan

```
┌──────────────────────┬─────────────────────┬─────────────────────┐
│   KARAKTERISTIK      │   ACCESS TOKEN      │   REFRESH TOKEN     │
├──────────────────────┼─────────────────────┼─────────────────────┤
│ 🎯 Tujuan            │ Akses API/Resource  │ Dapat token baru    │
├──────────────────────┼─────────────────────┼─────────────────────┤
│ ⏰ Masa Berlaku      │ PENDEK (15 menit)   │ PANJANG (7 hari)    │
├──────────────────────┼─────────────────────┼─────────────────────┤
│ 📤 Dikirim Kemana    │ Setiap request API  │ Hanya ke /refresh   │
├──────────────────────┼─────────────────────┼─────────────────────┤
│ 💾 Disimpan Dimana   │ Memory/LocalStorage │ Database + Client   │
├──────────────────────┼─────────────────────┼─────────────────────┤
│ 🔒 Keamanan          │ Medium (sering use) │ High (jarang use)   │
├──────────────────────┼─────────────────────┼─────────────────────┤
│ 🔄 Frekuensi Pakai   │ Setiap detik        │ Setiap 15 menit     │
├──────────────────────┼─────────────────────┼─────────────────────┤
│ ❌ Jika Dicuri       │ Bahaya 15 menit     │ Bahaya 7 hari!      │
├──────────────────────┼─────────────────────┼─────────────────────┤
│ 🗑️ Bisa Dibatalkan   │ ❌ Tidak bisa       │ ✅ Bisa (di DB)     │
└──────────────────────┴─────────────────────┴─────────────────────┘
```

### Detail Perbedaan

#### 1. **Access Token** 🔑

```javascript
{
  "sub": 2,                    // User ID
  "email": "john@blog.com",    // Email
  "role": "AUTHOR",            // Role
  "iat": 1765287791,           // Issued at (kapan dibuat)
  "exp": 1765288691            // Expires (15 menit dari iat)
}
```

**Kenapa pendek?**
- Dikirim berkali-kali (risiko dicuri lebih tinggi)
- Jika dicuri, hacker hanya bisa pakai 15 menit
- Server tidak perlu cek database setiap request (cepat!)

#### 2. **Refresh Token** 🆔

```javascript
{
  "sub": 2,                    // User ID
  "email": "john@blog.com",    // Email
  "role": "AUTHOR",            // Role
  "iat": 1765287791,           // Issued at
  "exp": 1765892591            // Expires (7 hari dari iat)
}
```

**Kenapa panjang?**
- Jarang dipakai (hanya saat access token expired)
- Disimpan di database (bisa dibatalkan kapan saja)
- Lebih aman karena tidak dikirim setiap request

---

## 🤔 Mengapa Perlu 2 Token?

### Skenario 1: Hanya Pakai Access Token (Bahaya!)

```
❌ TANPA REFRESH TOKEN:
┌─────────────────────────────────────┐
│  Access Token: 7 hari               │
│  Dikirim setiap request             │
└─────────────────────────────────────┘
         │
         ▼
   🚨 MASALAH:
   1. Token sering terekspos (bahaya!)
   2. Jika dicuri → Hacker bisa akses 7 hari
   3. Tidak bisa batalkan token
   4. User harus login ulang tiap 7 hari
```

### Skenario 2: Pakai Access + Refresh Token (Aman!)

```
✅ DENGAN REFRESH TOKEN:
┌─────────────────────────────────────┐
│  Access Token: 15 menit             │
│  Refresh Token: 7 hari              │
└─────────────────────────────────────┘
         │
         ▼
   ✨ KEUNTUNGAN:
   1. Access token pendek → Risiko kecil
   2. Jika dicuri → Hanya bahaya 15 menit
   3. Refresh token bisa dibatalkan di DB
   4. User tidak perlu login ulang 7 hari
   5. Balance antara keamanan & UX
```

### Analogi Keamanan Mobil

```
Access Token = Kunci Kontak (dipakai terus)
├─ Kalau hilang → Harus ganti segera
└─ Berlaku pendek supaya aman

Refresh Token = Surat Kendaraan (disimpan rumah)
├─ Jarang dibawa keluar
└─ Untuk proof ownership
```

---

## 🔄 Cara Kerja Step by Step

### Flow Diagram Lengkap

```
┌──────────────────────────────────────────────────────────────┐
│                    PHASE 1: LOGIN                             │
└──────────────────────────────────────────────────────────────┘

Client                    Server                    Database
  │                         │                          │
  │  1. POST /auth/login   │                          │
  │  { email, password }   │                          │
  ├────────────────────────>│                          │
  │                         │                          │
  │                         │  2. Cek user & password  │
  │                         ├─────────────────────────>│
  │                         │<─────────────────────────┤
  │                         │     ✅ User valid        │
  │                         │                          │
  │                         │  3. Generate 2 tokens:   │
  │                         │     • Access (15 min)    │
  │                         │     • Refresh (7 days)   │
  │                         │                          │
  │                         │  4. Hash & save refresh  │
  │                         ├─────────────────────────>│
  │                         │                          │
  │  5. Response:           │                          │
  │  {                      │                          │
  │    accessToken: "...",  │                          │
  │    refreshToken: "..."  │                          │
  │  }                      │                          │
  │<────────────────────────┤                          │
  │                         │                          │
  │  6. SIMPAN TOKENS:      │                          │
  │  • Access → Memory      │                          │
  │  • Refresh → Storage    │                          │
  │                         │                          │

┌──────────────────────────────────────────────────────────────┐
│              PHASE 2: AKSES API (0-15 menit)                 │
└──────────────────────────────────────────────────────────────┘

Client                    Server                    Database
  │                         │                          │
  │  7. GET /posts          │                          │
  │  Authorization:         │                          │
  │    Bearer <access>      │                          │
  ├────────────────────────>│                          │
  │                         │                          │
  │                         │  8. Verify access token: │
  │                         │     • Check signature    │
  │                         │     • Check expiration   │
  │                         │     ✅ Valid & not exp   │
  │                         │                          │
  │  9. Response: Posts     │                          │
  │<────────────────────────┤                          │
  │                         │                          │
  │  (User bisa pakai terus access token sampai expired)
  │                         │                          │

┌──────────────────────────────────────────────────────────────┐
│         PHASE 3: ACCESS TOKEN EXPIRED (Menit ke-16)          │
└──────────────────────────────────────────────────────────────┘

Client                    Server                    Database
  │                         │                          │
  │  10. GET /posts         │                          │
  │  Authorization:         │                          │
  │    Bearer <access-exp>  │                          │
  ├────────────────────────>│                          │
  │                         │                          │
  │                         │  11. Verify token:       │
  │                         │      ❌ Token expired!   │
  │                         │                          │
  │  12. 401 Unauthorized   │                          │
  │  { message: "Token      │                          │
  │    expired" }           │                          │
  │<────────────────────────┤                          │
  │                         │                          │
  │  13. Client deteksi:    │                          │
  │      "Oh, access token  │                          │
  │       expired!"         │                          │
  │                         │                          │

┌──────────────────────────────────────────────────────────────┐
│                PHASE 4: REFRESH TOKEN                         │
└──────────────────────────────────────────────────────────────┘

Client                    Server                    Database
  │                         │                          │
  │  14. POST /auth/refresh │                          │
  │  {                      │                          │
  │    refreshToken: "..."  │                          │
  │  }                      │                          │
  ├────────────────────────>│                          │
  │                         │                          │
  │                         │  15. Verify refresh:     │
  │                         │      • Check signature   │
  │                         │      • Check expiration  │
  │                         │      • Get user from DB  │
  │                         ├─────────────────────────>│
  │                         │<─────────────────────────┤
  │                         │                          │
  │                         │  16. Compare refresh     │
  │                         │      token dengan DB     │
  │                         │      ✅ Match!           │
  │                         │                          │
  │                         │  17. Generate NEW tokens:│
  │                         │      • New Access (15min)│
  │                         │      • New Refresh (7day)│
  │                         │                          │
  │                         │  18. Update refresh in DB│
  │                         ├─────────────────────────>│
  │                         │                          │
  │  19. Response:          │                          │
  │  {                      │                          │
  │    accessToken: "NEW",  │                          │
  │    refreshToken: "NEW"  │                          │
  │  }                      │                          │
  │<────────────────────────┤                          │
  │                         │                          │
  │  20. UPDATE TOKENS:     │                          │
  │  • Replace old tokens   │                          │
  │  • Continue using app   │                          │
  │                         │                          │

┌──────────────────────────────────────────────────────────────┐
│              PHASE 5: BACK TO NORMAL (Repeat 2-4)            │
└──────────────────────────────────────────────────────────────┘
```

### Timeline Visual

```
Waktu:  0min    5min    10min   15min   20min   25min   30min
        │       │       │       │       │       │       │
        │◄──────────────────────►│       │       │       │
        │   Access Token 1       │       │       │       │
        │      (Valid)            │       │       │       │
        │                         ▼       │       │       │
        │                    ❌ Expired   │       │       │
        │                         │       │       │       │
        │                    🔄 Refresh   │       │       │
        │                         │       │       │       │
        │                         │◄──────────────────────►│
        │                         │   Access Token 2       │
        │                         │      (Valid)           │
        │                         │                        │
        
User Experience:
┌────────────────────────────────────────────────────────────┐
│  "Seamless! Tidak perlu login ulang selama 7 hari"        │
└────────────────────────────────────────────────────────────┘
```

---

## 💻 Implementasi di NestJS

### Step 1: Setup Environment Variables

```env
# .env
JWT_SECRET="your-secret-key-for-access-token"
JWT_REFRESH_SECRET="your-different-secret-for-refresh"
JWT_EXPIRES_IN="15m"              # Access token: 15 menit
JWT_REFRESH_EXPIRES_IN="7d"      # Refresh token: 7 hari
```

**❗ Penting:**
- Access token dan Refresh token HARUS pakai secret berbeda
- Jika sama, hacker bisa forge refresh token

### Step 2: Auth Service - Generate Tokens

```typescript
// auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * 🔑 STEP 1: LOGIN - Generate kedua token
   */
  async login(email: string, password: string) {
    // 1. Cari user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate KEDUA token
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // 4. Save refresh token ke database
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // 5. Return user + tokens
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  /**
   * 🎫 FUNGSI PENTING: Generate Access + Refresh Token
   */
  private async generateTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    
    // Payload yang sama untuk kedua token
    const payload = {
      sub: userId,
      email: email,
      role: role,
    };

    // 🔑 Generate ACCESS TOKEN (15 menit)
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'), // '15m'
    });

    // 🆔 Generate REFRESH TOKEN (7 hari)
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'), // ⚠️ Secret berbeda!
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'), // '7d'
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 💾 STEP 2: Simpan refresh token ke database (hashed)
   */
  private async updateRefreshToken(userId: number, refreshToken: string) {
    // Hash refresh token sebelum simpan (keamanan ekstra!)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedRefreshToken, // Simpan yang sudah di-hash
      },
    });
  }

  /**
   * 🔄 STEP 3: Refresh Token - Dapat token baru
   */
  async refreshTokens(refreshToken: string) {
    try {
      // 1. Verify refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'), // ⚠️ Secret refresh!
      });

      // 2. Cari user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 3. Compare refresh token dengan yang di database
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 4. Generate tokens BARU
      const tokens = await this.generateTokens(
        user.id,
        user.email,
        user.role,
      );

      // 5. Update refresh token di database
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      // 6. Return tokens baru
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * 🚪 STEP 4: Logout - Hapus refresh token
   */
  async logout(userId: number) {
    // Hapus refresh token dari database
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null, // ⚠️ Token tidak bisa dipakai lagi!
      },
    });

    return { message: 'Logged out successfully' };
  }
}
```

### Step 3: Auth Controller - Endpoints

```typescript
// auth.controller.ts

import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 🔐 LOGIN ENDPOINT
   * Input: email + password
   * Output: user + accessToken + refreshToken
   */
  @Public() // ⚠️ Tidak perlu auth untuk login
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  /**
   * 🔄 REFRESH TOKEN ENDPOINT
   * Input: refreshToken
   * Output: new accessToken + new refreshToken
   */
  @Public() // ⚠️ Tidak perlu auth untuk refresh
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshTokens(body.refreshToken);
  }

  /**
   * 🚪 LOGOUT ENDPOINT
   * Input: user dari JWT
   * Output: success message
   */
  @Post('logout')
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id);
  }

  /**
   * 👤 GET PROFILE ENDPOINT
   * Input: accessToken (via header)
   * Output: user data
   */
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }
}
```

### Step 4: JWT Strategy - Verify Access Token

```typescript
// strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      // 1. Extract token dari header Authorization
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // 2. Jangan ignore expiration
      ignoreExpiration: false, // ⚠️ Penting! Reject token expired
      
      // 3. Secret untuk verify
      secretOrKey: configService.get('JWT_SECRET'), // ⚠️ Access token secret
    });
  }

  /**
   * Method ini dipanggil setelah token berhasil di-verify
   * Payload sudah didecode otomatis oleh Passport
   */
  async validate(payload: any) {
    // Return user info yang akan dimasukkan ke req.user
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

### Step 5: Client Side Implementation

```typescript
// client/auth.service.ts (Frontend)

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  /**
   * 1️⃣ LOGIN
   */
  async login(email: string, password: string) {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Simpan tokens
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;

    // Optional: Simpan ke localStorage (untuk persistent)
    localStorage.setItem('refreshToken', data.refreshToken);

    return data.user;
  }

  /**
   * 2️⃣ API REQUEST dengan Auto Refresh
   */
  async apiRequest(url: string, options: RequestInit = {}) {
    // Tambahkan access token ke header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.accessToken}`,
    };

    let response = await fetch(url, { ...options, headers });

    // ❌ Jika 401 Unauthorized (token expired)
    if (response.status === 401) {
      console.log('Access token expired, refreshing...');
      
      // 🔄 Refresh token otomatis
      const refreshed = await this.refresh();
      
      if (refreshed) {
        // ✅ Retry request dengan token baru
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(url, { ...options, headers });
      }
    }

    return response.json();
  }

  /**
   * 3️⃣ REFRESH TOKEN
   */
  private async refresh(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        // ❌ Refresh gagal, logout user
        this.logout();
        return false;
      }

      const data = await response.json();

      // ✅ Update tokens
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;

      // Update localStorage
      localStorage.setItem('refreshToken', data.refreshToken);

      return true;
    } catch (error) {
      console.error('Refresh failed:', error);
      this.logout();
      return false;
    }
  }

  /**
   * 4️⃣ LOGOUT
   */
  async logout() {
    // Hapus tokens dari memory
    this.accessToken = null;
    this.refreshToken = null;

    // Hapus dari localStorage
    localStorage.removeItem('refreshToken');

    // Optional: Panggil backend logout
    await fetch('http://localhost:3000/api/v1/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
    });

    // Redirect ke login page
    window.location.href = '/login';
  }

  /**
   * 5️⃣ RESTORE SESSION (saat app load)
   */
  async restoreSession() {
    const savedRefreshToken = localStorage.getItem('refreshToken');
    
    if (savedRefreshToken) {
      this.refreshToken = savedRefreshToken;
      
      // Coba refresh untuk dapat access token baru
      await this.refresh();
    }
  }
}

// Usage Example
const auth = new AuthService();

// Login
await auth.login('john@blog.com', 'password123');

// Make API request (auto refresh jika expired)
const posts = await auth.apiRequest('http://localhost:3000/api/v1/posts');

// Logout
await auth.logout();
```

---

## 🌍 Contoh Real World

### Scenario: User browsing blog selama 1 jam

```
Timeline:
───────────────────────────────────────────────────────────────

00:00 - User login
        ✅ Dapat: Access Token (exp: 00:15) + Refresh Token (exp: 7 days)

00:05 - User browse posts
        🔑 Request dengan Access Token
        ✅ Success

00:10 - User create post
        🔑 Request dengan Access Token
        ✅ Success

00:15 - User add comment
        🔑 Request dengan Access Token
        ❌ 401 Unauthorized (Token expired!)
        
        🔄 Auto refresh:
           - Client kirim Refresh Token
           - Server verify & generate new tokens
           - ✅ Dapat: New Access Token (exp: 00:30) + New Refresh Token
           - Retry request
           - ✅ Success

00:20 - User edit profile
        🔑 Request dengan NEW Access Token
        ✅ Success

00:30 - User upload avatar
        🔑 Request dengan NEW Access Token
        ❌ 401 Unauthorized (Token expired lagi!)
        
        🔄 Auto refresh lagi
        ✅ Success

00:45 - User continue browsing
        🔑 Request dengan NEWEST Access Token
        ✅ Success

01:00 - User close browser
        💾 Refresh Token masih valid (expired 7 hari)
        
Next Day:
───────────────────────────────────────────────────────────────

08:00 - User open browser lagi
        📱 App load
        🔍 Check localStorage: Found Refresh Token!
        🔄 Auto refresh
        ✅ Dapat Access Token baru
        ✅ User langsung logged in! (Tidak perlu login ulang)
```

### Scenario: Token dicuri hacker

```
❌ JIKA HANYA ACCESS TOKEN YANG DICURI:
──────────────────────────────────────
Waktu: 14:30
Hacker: Steal Access Token (exp: 14:45)

14:30 - Hacker bisa akses API ✅
14:35 - Hacker bisa akses API ✅
14:40 - Hacker bisa akses API ✅
14:45 - Token EXPIRED ❌
14:46 - Hacker TIDAK bisa akses lagi ❌

Damage: Hanya 15 menit! 
Action: User ganti password, semua refresh token di-invalidate

✅ JIKA REFRESH TOKEN TIDAK DICURI:
──────────────────────────────────
User tetap aman karena:
- Refresh token disimpan secure
- Hacker tidak bisa refresh
- User continue normal
```

---

## ⭐ Best Practices

### 1. **Token Expiration Time**

```typescript
// ✅ RECOMMENDED:
JWT_EXPIRES_IN="15m"              // Access: 15 menit
JWT_REFRESH_EXPIRES_IN="7d"       // Refresh: 7 hari

// ❌ TIDAK DISARANKAN:
JWT_EXPIRES_IN="1h"               // Terlalu lama (risiko tinggi)
JWT_REFRESH_EXPIRES_IN="30d"      // Terlalu lama
```

**Alasan:**
- Access token pendek: Minimize damage jika dicuri
- Refresh token panjang: Good user experience

### 2. **Secret Keys**

```typescript
// ✅ BENAR: 2 secret berbeda
JWT_SECRET="random-string-1"
JWT_REFRESH_SECRET="random-string-2"

// ❌ SALAH: Secret yang sama
JWT_SECRET="same-secret"
JWT_REFRESH_SECRET="same-secret"
```

### 3. **Storage**

```typescript
// ✅ ACCESS TOKEN:
// - Simpan di memory (variable)
// - Atau sessionStorage (hilang saat close tab)

// ✅ REFRESH TOKEN:
// - Simpan di localStorage (persistent)
// - Atau httpOnly cookie (paling aman!)

// ❌ JANGAN:
// - Simpan access token di localStorage (XSS attack)
```

### 4. **Refresh Token Rotation**

```typescript
// ✅ BENAR: Generate refresh token baru setiap refresh
async refreshTokens(refreshToken: string) {
  // ...verify...
  
  // Generate BARU
  const newTokens = await this.generateTokens(...);
  
  // Update di database
  await this.updateRefreshToken(userId, newTokens.refreshToken);
  
  return newTokens; // ⚠️ Return yang baru!
}

// ❌ SALAH: Pakai refresh token yang sama terus
// Bahaya! Jika dicuri, hacker bisa pakai selamanya
```

### 5. **Logout Implementation**

```typescript
// ✅ BENAR: Hapus refresh token dari database
async logout(userId: number) {
  await this.prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null } // ⚠️ Invalidate!
  });
}

// Benefit:
// - Refresh token tidak bisa dipakai lagi
// - User harus login ulang
// - Hacker tidak bisa refresh
```

### 6. **Multiple Device Support**

```typescript
// Schema dengan multiple refresh tokens
model User {
  id            Int      @id @default(autoincrement())
  email         String   @unique
  password      String
  refreshTokens RefreshToken[] // ⚠️ Array of tokens!
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  device    String?  // "iPhone", "Chrome Desktop", etc
  createdAt DateTime @default(now())
  expiresAt DateTime
}

// Benefit:
// - User bisa login dari multiple device
// - Logout dari 1 device tidak affect device lain
// - Bisa track device mana yang login
```

---

## 🎓 Summary

### Key Points:

1. **Access Token** = Kartu kunci (15 menit)
   - Untuk akses API
   - Pendek & aman
   - Tidak bisa dibatalkan

2. **Refresh Token** = Identitas (7 hari)
   - Untuk dapat access token baru
   - Panjang & convenient
   - Bisa dibatalkan di database

3. **Flow:**
   - Login → Dapat 2 tokens
   - Pakai access token → Sampai expired
   - Refresh → Dapat tokens baru
   - Repeat

4. **Keamanan:**
   - 2 secret berbeda
   - Hash refresh token di DB
   - Rotate refresh token
   - Store dengan benar

5. **User Experience:**
   - Tidak perlu login ulang 7 hari
   - Seamless auto refresh
   - Aman dari hacker

### Analogi Terakhir:

```
Access Token  = Tiket masuk bioskop (1x pakai, expired)
Refresh Token = Member card (bisa dapat tiket baru)

User tidak perlu antri beli tiket terus,
cukup tunjukkan member card untuk dapat tiket baru!
```

---

**🎉 Selamat! Kamu sudah paham Access Token vs Refresh Token!**

**Next Steps:**
1. Implement di project sendiri
2. Test dengan Postman
3. Monitor di Prisma Studio
4. Coba logout/login dari berbagai device

**Resources:**
- JWT.io - Decode tokens
- Prisma Studio - Monitor tokens
- Postman - Test refresh flow
