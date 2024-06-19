export interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
