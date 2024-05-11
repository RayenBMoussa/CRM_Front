import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";


const AdminDashboard = () => {
    const router = useNavigate()
    const { user} = useAuthContext()
    useEffect(() => {
        if (user?.userType !== "admin") router("/login")
        
    }, [user])
    return (

        <div>
            <Navbar />
            <Outlet />
        </div>
    );
}

export default AdminDashboard;