import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";


const AdminAccount = () => {
    const router = useNavigate()
    const { user} = useAuthContext()
    useEffect(() => {
        if (user?.userType !== "admin") router("/login")
        
    }, [user])
    return (

        <div className="pages">
            <Navbar />
            <Outlet />
        </div>
    );
}

export default AdminAccount;