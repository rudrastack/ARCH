import React from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    console.log(user)

    if (loading) {
        return <div style={{ color: "white" }}>Loading...</div>
    }
    if (!user) {
        return <Navigate to="/login" />
    }
    if (user.role !== "seller") {
        return <Navigate to="/" />
    }
    return children
}

export default Protected