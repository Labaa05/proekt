import {db} from "./db.js"
/**
 * @param {Object} user - The employee who is responsible for the project.
 * @param {string} user.username - The name of the employee.
 * @param {string} user.email
 * @param {string} user.password
 * @param {string} user.confirmpassword
 */
export function register(user) {
    console.log(user)
    if (user.password !== user.confirmpassword) 
    {
        return false
    }
    try {
        db.run("INSERT INTO users (username, email, password) VALUES($username, $email, $password)", {
            $username: user.username,
            $email: user.email,
            $password: user.password
        });
        return true
    } catch (error) {
    return false
    }
}