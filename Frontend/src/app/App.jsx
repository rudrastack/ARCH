import './App.css';
import { RouterProvider } from 'react-router';
import { routes } from './app.route.jsx';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useAuth } from '../features/auth/hook/useAuth.js'


function App() {
    const { handleGetMe } = useAuth()

    const user = useSelector(state => state.auth.user)

    useEffect(() => {
        handleGetMe()
    }, [])
    console.log(user)


    return (
        <>
            <RouterProvider router={routes} />
        </>

    );

}
export default App;