import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Load environment variables from .env file
config();

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts", // jalankan seed.ts dengan TSX
  },
});
