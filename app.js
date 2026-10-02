require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const paradojaRoutes = require("./routes/paradojaRoutes");
const respuestaRoutes = require("./routes/respuestaRoutes");
const dueloRoutes = require("./routes/dueloRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/paradojas", paradojaRoutes);
app.use("/api/respuestas", respuestaRoutes);
app.use("/api/duelos", dueloRoutes);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB correctamente"))
  .catch((err) => console.error("Error al conectar con MongoDB: " + err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto " + PORT);
});