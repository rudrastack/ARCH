import './App.css';
import { RouterProvider } from 'react-router';
import { routes } from './app.route.jsx';

function App() {
    return (
        <>
            <RouterProvider router={routes} />
        </>

    );

}
export default App;