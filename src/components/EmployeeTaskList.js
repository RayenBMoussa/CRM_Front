import { FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { IconContext } from "react-icons";
import { GrTask } from "react-icons/gr";
import Tooltip from '@mui/material/Tooltip';
import { Link } from "react-router-dom";

const EmployeeTaskList = ({ task }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'en-CA' locale formats the date as yyyy-mm-dd
    };
    return (
        <>
            <tr>

                <td>{task.taskName}</td>
                <td>{formatDate(task.startDate)}</td>
                <td>{`${task.estimation}d`}</td>
                <td>
                    <span className={task.taskStatus === "Not Started" ? "status-not-started" :
                        task.taskStatus === "In Progress" ? "status-in-progress" :
                            task.taskStatus === "Completed" ? "status-completed" :
                                task.taskStatus === "On Hold" ? "status-on-hold" :
                                    task.taskStatus === "Cancelled" ? "status-cancelled" : ""}>
                        {task.taskStatus}
                    </span>
                </td>
                <td className={task.priority === "low" ? "priority-low" : task.priority === "medium" ? "priority-medium" : task.priority === "high" ? "priority-high" : ""}>
                    {task.priority === "low" &&
                        <IconContext.Provider value={{ className: "icn" }}><FcLowPriority /></IconContext.Provider>}
                    {task.priority === "medium" &&
                        <IconContext.Provider value={{ className: "icn" }}><FcMediumPriority /></IconContext.Provider>}
                    {task.priority === "high" &&
                        <IconContext.Provider value={{ className: "icn" }}><FcHighPriority /></IconContext.Provider>}
                    {task.priority}
                </td>
                <td >

                    <div className="action-icons">
                    <Link className="task-link" to={`/employeeAccount/Management/${task._id}`}>
                        <IconContext.Provider value={{className:"task-icon",title:"details"}}>
                        
                        <TbListDetails />
                        
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

export default EmployeeTaskList;