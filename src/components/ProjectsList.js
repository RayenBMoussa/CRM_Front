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

const ProjectsList = ({ project }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { dispatch } = useProjectsContext()
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'en-CA' locale formats the date as yyyy-mm-dd
    };

    const handleDelete = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        const response = await fetch("/api/Acm_CRM//deleteProject/" + project._id, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token.token}`
            }
        });
        const json = await response.json();
        

        if (response.ok) {
            dispatch({ type: "DELETE_PROJECT", payload: json });
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
                <td>
                    <Link className="details" to={`/adminAccount/edit-project/${project._id}`}>
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

export default ProjectsList;

