import { register, login, getMe, logoutAPI } from "../service/auth.api.js";
import { setError, setLoading, setUser } from "../state/auth.slice";
import { useDispatch, useSelector } from "react-redux";

export const useAuth = () => {
    const dispatch = useDispatch();
    const error = useSelector((state) => state.auth.error);
    const loading = useSelector((state) => state.auth.loading);


    async function handleRegister({ email, password, fullname, contact, isSeller = false }) {
        const data = await register({ email, password, fullname, contact, isSeller })
        dispatch(setUser(data.user))
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(""));

            const data = await login({ email, password });

            dispatch(setUser(data.user));

            return data.user;

        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Invalid email or password";

            dispatch(setError(message));

            throw err;

        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogout() {
        try {
            await logoutAPI();

            dispatch(setUser(null));
            dispatch(setError(""));

        } catch (err) {
            console.error("Logout failed:", err);
        }
    };


    return {
        error,
        loading,
        handleLogin,
        handleGetMe,
        handleLogout,
        handleRegister,
    }
}