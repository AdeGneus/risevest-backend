import "dotenv";
import "reflect-metadata";

import app from "./app";
import config from "./config/index";
import AppDataSource from "./datasource";
import log from "./utils/logger";

const port = config.PORT;

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      log.info(`App is listening on port ${port}`);
    });
  })
  .catch((error) => log.error(error));
