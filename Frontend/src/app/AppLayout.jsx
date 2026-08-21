import React from 'react'
import Navbar from '../features/shared/components/Nav.jsx'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>

    )
}

export default AppLayout