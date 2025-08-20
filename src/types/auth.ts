export type User = {
  id: string;
  username: string;
  telegramId?: number;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
};

export type AuthTokens = {
  token: string;
  authtoken?: string;
};
