import { createBrowserRouter } from "react-router";
import { RegisterPage } from "../features/auth/pages/Register.jsx";
export const routes = createBrowserRouter([
    {
        path: "/",
        element: <div className="min-h-screen bg-neutral-950"></div>
    },
    {
        path: "/register",
        element: <RegisterPage />
    }
]);