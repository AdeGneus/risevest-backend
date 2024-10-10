import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";

import config from "./config/index";
import { MethodNotAllowedError } from "./exceptions/methodNotAllowedError";
import { NotFoundError } from "./exceptions/notFoundError";
import globalErrorHandler from "./middlewares/errorHandler";
import router from "./routes/index.route";

const app: Express = express();
app.disable("x-powered-by");

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "User's Post Management API is running.",
  });
});

app.use("/" + config.API_PREFIX, router);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next();
  }
  next(
    new MethodNotAllowedError(
      `Method ${req.method} not allowed on ${req.originalUrl}`,
    ),
  );
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

export default app;
