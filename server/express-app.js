import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.js";
import trackingRouter from "./routes/tracking.js";
import cookieParser from "cookie-parser";

export default async function expressApp(app) {
  app.use(bodyParser.json());
  app.use(cookieParser());

  //   app.use(cors());
  app.use(
    cors({
      origin: "http://localhost:5173", // your React dev server
      credentials: true,
    })
  );
  app.use("/api/auth", authRouter);
  app.use("/api/track", trackingRouter);
}
