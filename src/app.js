import path from "path";
import express from "express";
import { engine } from "express-handlebars";

import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";

const PORT = 8080;
const app = express();

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(import.meta.dirname, "/views"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(import.meta.dirname, "/public")))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
