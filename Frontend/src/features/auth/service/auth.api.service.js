import axios from "axios";

const authApiInsertion = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true

})

export const registerAPI = async ({ email, password, fullname, contact, isSeller }) => {
    const result = await authApiInsertion.post('/register', { email, password, fullname, contact, isSeller })
    return result.data
}
