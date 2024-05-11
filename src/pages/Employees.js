
import { IoIosAddCircle } from "react-icons/io";
import { IconContext } from "react-icons";
import { useEmployeesContext } from "../hooks/useEmployeesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect } from "react";
import EmployeesList from "../components/EmployeesList"
import AddEmployeeForm from "../components/addEmployeeForm";
import { useState } from "react";

const Employees = () => {
    const { employees, dispatch } = useEmployeesContext()
    const { user } = useAuthContext()
    const admin = user?.userType === "admin";
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false); }

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = JSON.parse(localStorage.getItem('token'))

            const response = await fetch("/api/Acm_CRM/employees", {
                headers: { "Authorization": `Bearer ${token.token}` }

            })
            const json = await response.json()
            if (response.ok) {
                dispatch({ type: "GET_EMPLOYEES", payload: json })
            }
        }
        if (admin) {
            fetchEmployees()
        }
    }, [dispatch, admin])

    
    return (
        <div className="employee-container">
            <div className="page-title">
                <h3>Employees</h3>
            </div>
            <div className="second-line">
                <span className="list-activity">
                    <span className="span-list">List</span>
                    <span className="span-activity">Activity</span>
                </span>
                <div className="add-icon" onClick={handleOpen}>
                    <IconContext.Provider value={{ className: "plus-icon" }}>
                        <IoIosAddCircle />
                    </IconContext.Provider>
                </div>
            </div>

            
            <div className="sub-container">
            <AddEmployeeForm open={open} handleClose={handleClose} />
                {employees?.map((employee) => (
                    <div className="cards" key={employee._id}>
                        <EmployeesList employee={employee} />
                    </div>
                ))}
            </div>

            
        </div>
    );
}

export default Employees;