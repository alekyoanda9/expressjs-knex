import { web } from "./application/web";
import { logger } from "./application/logging";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

web.listen(PORT, () => {
    logger.info(`App start at http://localhost:${PORT}`);
});