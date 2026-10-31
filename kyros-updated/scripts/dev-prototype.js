import { createServer } from "vite";

// Local demo mode is opt-in and does not modify either .env file.
process.env.VITE_USE_MOCK_API = "true";

const server = await createServer({
  mode: "development",
  server: { host: "127.0.0.1", port: Number(process.env.KYROS_PORT) || 5177, strictPort: true },
});

await server.listen();
server.printUrls();

const shutdown = async () => {
  await server.close();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
