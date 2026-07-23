import { createBrowserRouter } from "react-router";
import RegisterPage from "../features/auth/pages/Register";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>home page</h1>
    },
    {
        path: "/register",
        element: <RegisterPage />
    }
]);