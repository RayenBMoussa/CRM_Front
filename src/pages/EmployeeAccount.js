import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import NavbarEmployee from "../components/NavbarEmployee"

const EmployeeAccount = () => {
    const router = useNavigate()
    const { user } = useAuthContext()
    useEffect(() => {

        if (user?.userType !== "employee") router("/login")

    }, [user])
    return (
        <div className="pages">
            <NavbarEmployee/>
            <Outlet />
        </div>
    );
}

export default EmployeeAccount;