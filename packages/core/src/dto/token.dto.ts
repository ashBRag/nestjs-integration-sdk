export class TokenDto {
  accountId: string;
  integration: string;
  token: string;
  expiresAt: number;
  createdAt: number;
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
