import { usersModel } from "./models/userModel.js"


export class UserManagerMongo {

    // Obtener usuario

    static async getBy(filter) {
        return await usersModel.findOne(filter).lean()
    }

    // Crear usuario

    static async createUser(user={}) {
        let newUser = await usersModel.create(user)
        return newUser.toJSON()
    }


}