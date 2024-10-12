import { sign, SignOptions, verify } from "jsonwebtoken";
import config from "../config";
import { CustomJwtPayload } from "../interface";
import log from "./logger";

export const signToken = (
  id: string,
  keyName: string,
  options?: SignOptions | undefined,
) => {
  const signingKey = Buffer.from(config[keyName], "base64").toString("ascii");

  return sign({ id }, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyToken = (
  token: string,
  keyName: string,
): CustomJwtPayload => {
  const publicKey = Buffer.from(config[keyName], "base64").toString("ascii");

  try {
    const decoded = verify(token, publicKey) as CustomJwtPayload;
    return decoded;
  } catch (error: any) {
    log.error("Token verification failed");
    throw error;
  }
};
