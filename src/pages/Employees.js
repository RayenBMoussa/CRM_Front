import { IoIosAddCircle } from "react-icons/io";
import { IconContext } from "react-icons";
import { useEmployeesContext } from "../hooks/useEmployeesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import EmployeesList from "../components/EmployeesList";
import AddEmployeeForm from "../components/addEmployeeForm";

const Employees = () => {
    const { employees, dispatch } = useEmployeesContext();
    const { user } = useAuthContext();
    const admin = user?.userType === "admin";
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Set items per page
    const [showAlert, setShowAlert] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = JSON.parse(localStorage.getItem('token'));

            const response = await fetch("/api/Acm_CRM/employees", {
                headers: { "Authorization": `Bearer ${token.token}` }
            });
            const json = await response.json();
            if (response.ok) {
                dispatch({ type: "GET_EMPLOYEES", payload: json });
            }
        };
        if (admin) {
            fetchEmployees();
        }
    }, [dispatch, admin]);
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);

            }, 3000); 

            return () => clearTimeout(timer); 
        }
    }, [showAlert]);

    // Pagination logic
    const totalPages = employees ? Math.ceil(employees.length / itemsPerPage) : 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = employees?.slice(indexOfFirstItem, indexOfLastItem) || [];

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                <AddEmployeeForm open={open} handleClose={handleClose}  onUserAdded={() => setShowAlert(true)} />
                {showAlert && (
                    <div className="alert">
                        User added successfully!
                    </div>
                )}
                {currentItems.map((employee) => (
                    <div className="cards" key={employee._id}>
                        <EmployeesList employee={employee} />
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Employees;
