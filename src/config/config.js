export const config = {
    PORT: 8080,
    PRODUCTS_PATH: "./src/data/products.json",
    CARTS_PATH: "./src/data/carts.json",
    URL_MONGO: "mongodb+srv://giginaranjo:99ICbuM8LbORGjIl@cluster0.bitwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    DB_NAME: "ecommerce",
    SECRET: "NaranjoBackend",
    SECRET_SESSION: "NaranjoBackend",
    GITHUB_CLIENT_ID: "Iv23lig33Rnkbjx0vgqx",
    GITHUB_CLIENT_SECRET: "ea4a766d30bb96e78d81537a4061afa11f193ee8",
    GITHUB_CALLBACK_URL: "http://localhost:8080/api/sessions/callbackgithub",
    USER_NAME_ADMIN: "admincoder@coder.com",
    PASSWORD_ADMIN: "adminCod3r123"
}



/* import dotenv from "dotenv"

dotenv.config(
    {
        path: "./src/.env",
        override: true
    }
)

export const config = {
    PORT: process.env.PORT,
    PRODUCTS_PATH: process.env.PRODUCTS_PATH,
    CARTS_PATH: process.env.CARTS_PATH,
    URL_MONGO: process.env.URL_MONGO,
    DB_NAME: process.env.DB_NAME,
    SECRET: process.env.SECRET,
    SECRET_SESSION: process.env.SECRET_SESSION,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    USER_NAME_ADMIN: process.env.USER_NAME_ADMIN,
    PASSWORD_ADMIN: process.env.PASSWORD_ADMIN
}

console.log(config);

PORT = 8080,
PRODUCTS_PATH = ./src/data/products.json,
CARTS_PATH = ./src/data/carts.json,
URL_MONGO = mongodb+srv://giginaranjo:99ICbuM8LbORGjIl@cluster0.bitwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0,
DB_NAME = ecommerce,
SECRET = NaranjoBackend,
SECRET_SESSION = NaranjoBackend,
GITHUB_CLIENT_ID = Iv23lig33Rnkbjx0vgqx,
GITHUB_CLIENT_SECRET = ea4a766d30bb96e78d81537a4061afa11f193ee8,
GITHUB_CALLBACK_URL = http://localhost:8080/api/sessions/callbackgithub,
USER_NAME_ADMIN = admincoder@coder.com,
PASSWORD_ADMIN = adminCod3r123
 */