const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");

const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/todos";

main().catch((err) => {
  console.error("Failed to start application:", err);
  process.exit(1);
});

async function main() {
  await mongoose.connect(mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Healthcheck endpoint for container orchestrators
  app.get("/api/health", (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      return res.status(200).json({ status: "UP", db: "connected" });
    }
    return res.status(503).json({ status: "DOWN", db: "disconnected" });
  });

  app.use("/api", routes);

  const server = app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });

  // Graceful shutdown handler
  const shutdown = async (signal) => {
    console.log(`Received ${signal}. Closing HTTP server and DB connection...`);
    server.close(async () => {
      await mongoose.connection.close(false);
      console.log("Clean shutdown complete.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}