import { registerAPI } from "../service/auth.api.service";
import { setError, setLoading, setUser } from "../state/auth.slice";
import { useDispatch } from "react-redux";



export const useAuth = () => {
    const dispatch = useDispatch();

    async function handeRegister({ email, password, fullname, userName, isSeller }) {
        const data = await registerAPI({ email, password, fullname, userName, isSeller })
        dispatch(setUser(data.user))

    }
    return {
        user,
        loading,
        error,
        register,
        isSeller
    }
}