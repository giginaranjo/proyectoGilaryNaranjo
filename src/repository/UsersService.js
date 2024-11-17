import { UserManagerMongo as DAO} from "../dao/userManagerMongo.js"


class UsersService{
    constructor(dao){
        this.usersDAO = dao
    }

    async getUserByEmail(email){
        return await this.usersDAO.getBy(email)
    }

    async createUser(user){
        return await this.usersDAO.create(user)
    }
}

export const usersService = new UsersService(DAO)