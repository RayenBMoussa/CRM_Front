import "../styles/projectsAdmin.css"
import { IoIosAddCircle } from "react-icons/io";
import { IconContext } from "react-icons";
import { useProjectsContext } from "../hooks/useProjectsContext"
import ProjectsList from "../components/ProjectsList";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import AddNewProject from "../components/AddNewProject"
import TaskAdmin from "./TaskAdmin";
import AddNewTask from "../components/AddNewTask";

const ProjectsAdmin = () => {
    const { projects = [], dispatch } = useProjectsContext()
    const { user } = useAuthContext()
    const admin = user?.userType === "admin";
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [filters, setFilters] = useState({ projectStatus: "", priority: "", startDate: "" });
    const [isFilterOverlayOpen, setIsFilterOverlayOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('projects');

    const handleProjectsClick = () => setSelectedSection('projects');
    const handleTasksClick = () => setSelectedSection('tasks');
    const openCloseFilter = () => {
        setIsFilterOverlayOpen(prev => !prev);
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false); }
    useEffect(() => {
        const fetchProjects = async () => {
            const token = JSON.parse(localStorage.getItem('token'))

            const response = await fetch("/api/Acm_CRM/Projects", {
                headers: { "Authorization": `Bearer ${token.token}` }

            })
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: "GET_PROJECTS", payload: json })

            }
        }
        if (admin) {
            fetchProjects()
        }

    }, [dispatch, admin])
    // const totalPages = projects && projects.length > 0 ? Math.ceil(projects.length / itemsPerPage) : 1;


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
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


    return (
        <div className="projects-container">

            <div className="scnd-line">
                <span className="project-task">
                    <span className={`span-projects ${selectedSection === 'projects' ? 'selected' : 'not-selected'}`}
                        onClick={handleProjectsClick} >
                        Projects
                    </span>
                    <span className={`span-tasks ${selectedSection === 'tasks' ? 'selected' : 'not-selected'}`}
                        onClick={handleTasksClick}>
                        Tasks
                    </span>
                </span>
                <div className="add-btn" onClick={handleOpen}>
                    <IconContext.Provider value={{ className: "plus-icon" }}>
                        <IoIosAddCircle />
                    </IconContext.Provider>
                </div>

            </div>



            <div className="second-container">
                {selectedSection === 'projects' ? (
                    <>
                        <div className="filter-tasks" >

                            <div className="filter-item">
                                <label htmlFor="status-filter">Status:</label>
                                <select id="status-filter" value={filters.projectStatus} onChange={(e) => setFilters({ ...filters, projectStatus: e.target.value })} className="task-item">
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
                                <select id="priority-filter" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="task-item">
                                    <option value="">All</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="filter-item">
                                <label htmlFor="start-date-filter">Start Date:</label>
                                <input type="date" id="start-date-filter" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="task-date" />
                            </div>


                        </div>
                        <AddNewProject open={open} handleClose={handleClose} />
                        <div style={{
                            maxWidth: 'fit-content',
                            overflowX: 'auto'
                        }}>
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
                                    {currentItems.map((project) => (
                                        <ProjectsList key={project._id} project={project} />
                                    ))}
                                </tbody>
                            </table>
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
                    </>
                ) : (
                    <>
                        <AddNewTask open={open} handleClose={handleClose} />
                        <TaskAdmin />
                    </>
                )}
            </div>


        </div>
    );
}

export default ProjectsAdmin;