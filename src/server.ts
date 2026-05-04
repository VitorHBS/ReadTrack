import express, { urlencoded } from "express";
import helmet from "helmet";
import cors from "cors";
import { mainRouter } from "./routers/mainRouter.js";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler.js";

let limiter = rateLimit({
  limit: 3,
  windowMs: 30000,
  message: "We have received too many request from this IP, try again after 3 minute"
})

const server = express();
server.use("/auth", limiter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(helmet());
server.use(cors());
server.use(urlencoded({ extended: true }));
server.disable("x-powered-by");
server.use(express.json());

server.use(express.static(path.join(__dirname, "../public")));

server.use(mainRouter);

server.use(errorHandler)

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`O server está rodando em http://localhost:${port}`);
});