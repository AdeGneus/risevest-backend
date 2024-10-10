import { sign, SignOptions } from "jsonwebtoken";
import config from "../config";

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
