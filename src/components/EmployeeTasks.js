import { useAuthContext } from "../hooks/useAuthContext";
import { useTasksContext } from "../hooks/useTasksContext";
import EmployeeTaskList from "../components/EmployeeTaskList";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/EmployeeTasks.css"
import { IconContext } from "react-icons";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const EmployeeTasks = () => {
    const { tasks, dispatch } = useTasksContext();
    const { user } = useAuthContext();
    const [filters, setFilters] = useState({ taskStatus: "", priority: "", startDate: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const { id } = useParams();

    useEffect(() => {
        const fetchEmployeeTasks = async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const response = await fetch(`/api/Acm_CRM/MyTasks/${id}`, {
                headers: { "Authorization": `Bearer ${token.token}` }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: "GET_TASKS", payload: json });
            }
        };
        fetchEmployeeTasks();
    }, [dispatch, id]); // Added id to dependency array

    const employeeTasks = tasks.filter((task) => task.assignee === user._id);

    // Apply filters to employeeTasks
    const filteredTasks = employeeTasks.filter(task => {
        const statusMatches = !filters.taskStatus || task.taskStatus === filters.taskStatus;
        const priorityMatches = !filters.priority || task.priority === filters.priority;
        const startDateMatches = !filters.startDate || new Date(task.startDate) >= new Date(filters.startDate);
        return statusMatches && priorityMatches && startDateMatches;
    });

    // Pagination logic
    const totalPages = filteredTasks.length > 0 ? Math.ceil(filteredTasks.length / itemsPerPage) : 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="task-containerr">
            <div className="nd-lines">
                <Link to={`/employeeAccount/projects`}>
                    <div className="go-back">
                        <IconContext.Provider value={{ className: "icn-back" }}>
                            <MdOutlineKeyboardBackspace />
                        </IconContext.Provider><h5 className="back">Back to Projects</h5>
                    </div>
                </Link>
                <h3 className="taskss">Tasks</h3>
            </div>

            <div className="nd-containerr">
                <div className="filter-tasks">
                    <div className="filter-item">
                        <label htmlFor="status-filter">Status:</label>
                        <select
                            id="status-filter"
                            value={filters.taskStatus}
                            onChange={(e) => setFilters({ ...filters, taskStatus: e.target.value })}
                            className="task-item"
                        >
                            <option value="">All</option>
                            <option value="Not Started">Not Started</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label htmlFor="priority-filter">Priority:</label>
                        <select
                            id="priority-filter"
                            value={filters.priority}
                            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                            className="task-item"
                        >
                            <option value="">All</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label htmlFor="start-date-filter">Start Date:</label>
                        <input
                            type="date"
                            id="start-date-filter"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="task-date"
                        />
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>Task Name</th>
                            <th>Start Date</th>
                            <th>Estimation</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((task) => (
                            <EmployeeTaskList key={task._id} task={task} />
                        ))}
                    </tbody>
                </table>
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
        </div>
    );
}

export default EmployeeTasks;
