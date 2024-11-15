import dotenv from "dotenv"

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
