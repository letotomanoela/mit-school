import path from "path";
import express from "express";
import Classe from "./routes/Classe.js";
import Matiere from "./routes/Matiere.js";
import Etudiant from "./routes/Etudiant.js";
import Note from "./routes/Note.js";
import User from "./routes/User.js";
import Upload from "./routes/Upload.js";
import Stats from "./routes/Stats.js";
import errorHandler from "./middleware/error.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: ".env" });
const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors());
const __dirname = path.resolve();
app.use(
  "/back-end/uploads",
  express.static(path.join(__dirname, "./back-end/uploads"))
);

// Routes
app.use("/classe", Classe);
app.use("/matiere", Matiere);
app.use("/etudiant", Etudiant);
app.use("/note", Note);
app.use("/user", User);
app.use("/stats", Stats);
app.use("/upload", Upload);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/front-end/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "front-end", "dist", "index.html"));
  });
} else {
  app.get('/',(req,res)=> res.send('SERVER RUNNING'))
}

//Error handler middleware
app.use(errorHandler);

//Run the server
app.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
