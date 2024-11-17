export class UsersDTO {
    constructor(user) {
        this.first_name = user.first_name.toLowerCase(),
            this.last_name = user.last_name ? user.last_name.toLowerCase() : 'UNKNOWN',
            this.age = user.age ? Number(user.age) : 18,
            this.email = user.email.toLowerCase(),
            this.password = user.password ? user.password : '',
            this.cart = user.cart
    }

    static deletePassword(userLogin){
        let user = {...userLogin}
        delete user.password
        return user
    }

    static validName(name) {
        const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/
        return regex.test(name)
    }

    static validEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

}