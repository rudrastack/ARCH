// import { setError, setLoading, setUser } from "../state/auth.slice";
// import { register } from "../service/auth.api";
// import { useDispatch, useSelector } from "react-redux";

// export const useAuth = () => {
//     const dispatch = useDispatch();
//     const { loading, error } = useSelector((state) => state.auth);

//     async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
//         dispatch(setLoading(true));
//         dispatch(setError(null));

//         try {
//             const data = await register({ email, contact, password, fullname, isSeller });
//             dispatch(setUser(data.user));
//             return data.user;
//         } catch (err) {
//             const message = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || "Registration failed";
//             dispatch(setError(message));
//             throw err;
//         } finally {
//             dispatch(setLoading(false));
//         }
//     }

//     return { handleRegister, loading, error };
// };

import { setError, setLoading, setUser } from "../state/auth.slice"
import { register, login } from "../service/auth.api"
import { useDispatch } from "react-redux"



export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {

        const data = await register({ email, contact, password, fullname, isSeller })

        dispatch(setUser(data.user))

        return data.user
    }

    async function handleLogin({ email, password }) {

        const data = await login({ email, password })
        dispatch(setUser(data.user))
        
        return data.user
    }

    // async function handleGetMe() {
    //     try {
    //         dispatch(setLoading(true))
    //         const data = await getMe()
    //         dispatch(setUser(data.user))
    //     } catch (err) {
    //         console.log(err)
    //     } finally {
    //         dispatch(setLoading(false))
    //     }
    // }
  

    return { handleRegister, handleLogin }

}