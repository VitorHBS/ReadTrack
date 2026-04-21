import express, { urlencoded } from "express";
import helmet from "helmet";
import cors from "cors";
import { mainRouter } from "./routers/mainRouter.js";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const server = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(helmet());
server.use(cors());
server.use(urlencoded({ extended: true }));
server.disable("x-powered-by");
server.use(express.json());

server.use(express.static(path.join(__dirname, "../public")));

server.use(mainRouter);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`O server está rodando em http://localhost:${port}`);
});