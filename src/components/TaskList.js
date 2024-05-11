import { FiEdit } from "react-icons/fi";
import { IconContext } from "react-icons";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import "../styles/projectList.css"
import { FcHighPriority } from "react-icons/fc";
import { FcLowPriority } from "react-icons/fc";
import { FcMediumPriority } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useProjectsContext } from "../hooks/useProjectsContext";
import { useState } from "react";
import { Box } from "@mui/material";
import Popper from '@mui/material/Popper';
import { useTasksContext } from "../hooks/useTasksContext";

const TaskList = ({ task }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { dispatch } = useTasksContext()
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'en-CA' locale formats the date as yyyy-mm-dd
    };
    const handleDelete = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        const response = await fetch(`/api/Acm_CRM//deleteTask/${task._id}` , {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token.token}`
            }
        });
        const json = await response.json();
        

        if (response.ok) {
            dispatch({ type: "DELETE_TASK", payload: json });
            setShowConfirm(false)
        }
        // setShowConfirm(false); // Hide the confirmation popup after deletion
        if (!response.ok) {
            console.error('Failed to delete project:', response.statusText);
            return; // Exit the function if the request failed
        }
    };
   

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setShowConfirm(prev => !prev);
    };

    const handleClose = () => {
        setShowConfirm(false);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

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
                <td>
                    <Link className="details" to={`/adminDashboard/EditTask/${task._id}`}>
                        <IconContext.Provider value={{ className: "icn3" }}>
                            <TbListDetails/>
                        </IconContext.Provider>
                    </Link>
                    
                    <IconContext.Provider value={{ className: "icn2" }}>
                        {<MdDelete onClick={handleClick} />}
                    </IconContext.Provider>
                </td>
                <Popper id={id} open={showConfirm} anchorEl={anchorEl}>
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                        <p>Are you sure you want to delete this project?</p>
                        <div className="pop">
                            <button className="yes-no" onClick={handleDelete}>Yes</button>
                            <button className="yes-no" onClick={handleClose}>No</button>
                        </div>
                    </Box>
                </Popper>
            </tr>
        </>
    );
};

export default TaskList;

