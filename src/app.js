import __dirname from "./utils.js";
import path from "path";
import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { config } from "./config/config.js";

import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
// import ProductsManager from "./dao/productManager.js";
import {MongoProductsManager as ProductsManager} from "./dao/mongoProductManager.js";
import { connDB } from "./connDB.js";


const PORT = config.PORT;
const app = express();

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "/views"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)


const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

connDB()

const io = new Server(server)

const updateProducts = async () => {
    try {
        let products = await ProductsManager.getProducts()
        io.emit("updateProducts", products)
    } catch (error) {
        console.log(error.message);
    }
}

io.on("connection", (socket) => {

    updateProducts()

    socket.on("addProduct", async (data) => {
        try {
            const addedProduct = await ProductsManager.addProduct(data)
            socket.emit("addProduct", { status: "success", addedProduct })
            updateProducts()
        } catch (error) {
            socket.emit("addProduct", { status: "error", message: error.message })
        }


    })

    socket.on("modifyProduct", async (data) => {
        try {
            const modifiedProduct = await ProductsManager.modifyProduct(data.pid, data)
            socket.emit("modifyProduct", { status: "success", modifiedProduct })
            updateProducts()
        } catch (error) {
            socket.emit("modifyProduct", { status: "error", message: error.message })
        }
    })

    socket.on("deleteProduct", async (data) => {
        try {
            const deletedProduct = await ProductsManager.deleteProduct(data.pid)
            socket.emit("deleteProduct", { status: "success", deletedProduct })
            updateProducts()
        } catch (error) {
            socket.emit("deleteProduct", { status: "error", message: error.message })
        }
    })


})