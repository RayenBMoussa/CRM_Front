import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProjectsContext } from "../hooks/useProjectsContext";
import EmployeeProjectList from "../components/EmployeeProjectList";
import "../styles/projectsEmployee.css";

const ProjectsEmployee = () => {
    const { projects, dispatch } = useProjectsContext();
    const { user } = useAuthContext();
    const [filters, setFilters] = useState({ projectStatus: "", priority: "", startDate: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const fetchEmployeeProjects = async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const response = await fetch(`/api/Acm_CRM/MyProjects/${user._id}`, {
                headers: { "Authorization": `Bearer ${token.token}` }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: "GET_PROJECTS", payload: json });
            }
        };
        fetchEmployeeProjects();
    }, [dispatch, user._id]);

    const filteredProjects = projects?.filter(project => {
        const statusMatches = !filters.projectStatus || project.projectStatus === filters.projectStatus;
        const priorityMatches = !filters.priority || project.priority === filters.priority;
        const startDateMatches = !filters.startDate || new Date(project.startDate) >= new Date(filters.startDate);
        return statusMatches && priorityMatches && startDateMatches;
    });

    const totalPages = filteredProjects?.length > 0 ? Math.ceil(filteredProjects.length / itemsPerPage) : 1;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProjects?.slice(indexOfFirstItem, indexOfLastItem) || [];

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="containerr">
            <div className="nd-line">
                <h3 className="project">Projects</h3>
            </div>
            <div className="nd-containerr">
                <div className="filter-tasks">
                    <div className="filter-item">
                        <label htmlFor="status-filter">Status:</label>
                        <select
                            id="status-filter"
                            value={filters.projectStatus}
                            onChange={(e) => setFilters({ ...filters, projectStatus: e.target.value })}
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
                            <th>Project Name</th>
                            <th>Start Date</th>
                            <th>Estimation</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems?.map((project) => (
                            <EmployeeProjectList key={project._id} project={project} />
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
};

export default ProjectsEmployee;
