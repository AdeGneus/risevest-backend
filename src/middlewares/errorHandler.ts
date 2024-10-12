import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import { AppError } from "../exceptions/appError";
import { IResponseError } from "../interface";
import log from "../utils/logger";

const handleJWTError = (err: any) =>
  new AppError(`${err.message}!. Please log in again`, 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again", 401);

export const sendErrorDev = (err: any, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

export const sendErrorProd = (err: any, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      const appError = err as AppError;

      let response = {
        status: appError.status,
        message: appError.message,
        statusCode: appError.statusCode,
      } as IResponseError;

      return res.status(appError.statusCode).json(response);
    }

    log.error(`💥: ${err}`);

    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
      statusCode: 500,
    });
  }
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? "error";

  const env = config.NODE_ENV;

  if (env === "development") {
    sendErrorDev(err, req, res);
  } else if (env === "production") {
    if (err instanceof JsonWebTokenError) err = handleJWTError(err);
    if (err instanceof TokenExpiredError) err = handleJWTExpiredError();
    sendErrorProd(err, req, res);
  }
};

export default errorHandler;
