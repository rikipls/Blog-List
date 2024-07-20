import * as config from "./utils/config";
import { app } from "./app";
import * as logger from "./utils/logger";

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});