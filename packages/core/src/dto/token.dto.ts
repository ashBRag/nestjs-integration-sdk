export class TokenDto {
  accountId: string;
  integration: string;
  token: string;
  expiresAt: number;
  createdAt: number;
  refreshToken?: string;
}

export class TokenRequestDto {
  accountId: string;
  integration: string;
}

export class TokenRefreshResponseDto {
  token: string;
  expiresAt: number;
  refreshed: boolean;
}
