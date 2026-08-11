import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../features/auth/pages/Register.jsx";
import LoginPage from "../features/auth/pages/Login.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import GetSellerProducts from "../features/products/pages/GetSellerProducts.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import Home from "../features/products/pages/Home.jsx";
import ProductDetails from "../features/products/pages/ProductDetails.jsx";
import SellerProductDetails from "../features/products/pages/SellerProductDetails.jsx";
import Cart from "../features/cart/pages/Cart.jsx";


export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/details/:productId",
        element: <ProductDetails />,
    },

    {
        path: "/cart",
        element: <Protected> <Cart /> </Protected>
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/seller",
        children: [
            {
                path: "create",
                element: <Protected><CreateProduct /></Protected>,
            },
            {
                path: "get",
                element: <Protected><GetSellerProducts /></Protected>,
            }, {
                path: "variants/:productId",
                element: <Protected role="seller" >
                    <SellerProductDetails />
                </Protected>
            }
        ]
    }
])
