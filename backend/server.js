import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

console.log("Current directory:", process.cwd());
console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});