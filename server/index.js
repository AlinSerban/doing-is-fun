import express from "express";
import expressApp from "./express-app.js";
const PORT = 3000;

const StartServer = async () => {
  const app = express();

  await expressApp(app);

  app
    .listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    })
    .on("error", () => {
      console.error("Server error");
    });
};

StartServer();
