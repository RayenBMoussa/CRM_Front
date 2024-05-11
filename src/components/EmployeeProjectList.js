import { FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { IconContext } from "react-icons";
import { GrTask } from "react-icons/gr";
import Tooltip from '@mui/material/Tooltip';

import "../styles/EmployeeProjectList.css"
import { Link } from "react-router-dom";
const EmployeeProjectList = ({ project }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'en-CA' locale formats the date as yyyy-mm-dd
    };
    return (
        <>
            <tr>

                <td>{project.title}</td>
                <td>{formatDate(project.startDate)}</td>
                <td>{`${project.estimation}d`}</td>
                <td>
                    <span className={project.projectStatus === "Not Started" ? "status-not-started" :
                        project.projectStatus === "In Progress" ? "status-in-progress" :
                            project.projectStatus === "Completed" ? "status-completed" :
                                project.projectStatus === "On Hold" ? "status-on-hold" :
                                    project.projectStatus === "Cancelled" ? "status-cancelled" : ""}>
                        {project.projectStatus}
                    </span>
                </td>
                <td className={project.priority === "low" ? "priority-low" : project.priority === "medium" ? "priority-medium" : project.priority === "high" ? "priority-high" : ""}>
                    {project.priority === "low" &&
                        <IconContext.Provider value={{ className: "icn" }}><FcLowPriority /></IconContext.Provider>}
                    {project.priority === "medium" &&
                        <IconContext.Provider value={{ className: "icn" }}><FcMediumPriority /></IconContext.Provider>}
                    {project.priority === "high" &&
                        <IconContext.Provider value={{ className: "icn" }}><FcHighPriority /></IconContext.Provider>}
                    {project.priority}
                </td>
                <td >

                    <div className="action-icons">
                    
                        <IconContext.Provider value={{className:"details-icon",title:"details"}}>
                        
                        <TbListDetails />
                        
                        </IconContext.Provider>
                        <Link to={`/employeeAccount/tasks/${project._id}`}>
                        <IconContext.Provider value={{className:"task-icon"}}>
                        <GrTask/>
                        </IconContext.Provider>
                        </Link>
                        <IconContext.Provider value={{className:"delete-icon" }}>
                        <MdDelete  />
                        </IconContext.Provider>
                       
                       </div>
                </td>
                
            </tr>
        </>
    );
}

export default EmployeeProjectList;