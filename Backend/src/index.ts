import { server } from "./server/server";
import dotenv from "dotenv";
dotenv.config();

/* const PORT = process.env.PORT;
 */

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
