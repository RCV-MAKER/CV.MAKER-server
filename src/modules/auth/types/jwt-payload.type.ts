import { ROLE } from '@common/constants/entity.enum';

export type JwtPayloadType = {
  id: string;
  role: ROLE;
  sessionId: string;
  permissions: string[];
  iat: number;
  exp: number;
};
