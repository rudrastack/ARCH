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
import OrderSuccess from "../features/cart/pages/OrderSuccess.jsx";
import Collection from "../features/products/pages/Collection.jsx";
import AppLayout from "./AppLayout.jsx";


export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
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
        element: <AppLayout />,
        children: [
            {
                path: "/details/:productId",
                element: <ProductDetails />,
            },

            {
                path: "/cart",
                element: <Cart />
            },
            {
                path: "/order-success",
                element: <OrderSuccess />
            },
            {
                path: "/collection",
                element: <Collection />
            },
        ]
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
