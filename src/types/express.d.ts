import { CustomJwtPayload } from "../interface";

declare global {
  namespace Express {
    interface Request {
      user: CustomJwtPayload;
    }
  }
}
