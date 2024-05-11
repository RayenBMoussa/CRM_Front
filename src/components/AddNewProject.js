import { useProjectsContext } from "../hooks/useProjectsContext";
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { IoMdClose } from "react-icons/io";
import { IconContext } from "react-icons";
import "../styles/newProjectForm.css"
import { Select, MenuItem, Chip } from '@mui/material';

const AddNewProject = ({ open, handleClose }) => {
    const { dispatch } = useProjectsContext()
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [projectStatus, setProjectStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [estimation, setEstimation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [deadline, setDeadline] = useState("");
    const [assignees, setAssignees] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // const isoDateString = birthday_date ? birthday_date.toISOString() : null;
        const project = {
            title,
            description,
            projectStatus,
            priority,
            estimation,
            startDate,
            deadline,
            assignees
        };

        const token = JSON.parse(localStorage.getItem('token'));
        const response = await fetch("/api/Acm_CRM/newProject", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token.token}`, "Content-Type": "application/json" },
            body: JSON.stringify(project),
        });
        const json = await response.json();
        if (!response.ok) {
            setError(json.error);
        }



        if (response.ok) {
            dispatch({ type: 'CREATE_PROJECTS', payload: json.project })
            resetForm();
            handleClose(); // Close the modal
            setShowAlert(true);
            
            
        }
    };
    const handleStatus = (event) => {
        setProjectStatus(event.target.value);
    };
    const handlePriority = (event) => {
        setPriority(event.target.value);
    };
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setProjectStatus("");
        setPriority("");
        setStartDate("");
        setDeadline("");
        setEstimation("");
        setAssignees([]);
        setError(null);
    };

    useEffect(() => {
        if (!open) {
            resetForm();
            setShowAlert(false);
        }
    }, [open]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await fetch("/api/Acm_CRM/employees", {
                headers: { "Authorization": `Bearer ${token.token}` }

            })
            const json = await response.json()
            
            if (response.ok) {
                setUsers(json);
            }
        };
        fetchUsers();
    }, []);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='modal-project'
            style={{
                outline: "none"
            }}
        >
            <div className="project-form">
                <IconContext.Provider value={{ className: "close-modal" }}>
                    <IoMdClose onClick={handleClose} />
                </IconContext.Provider>
                <div className="title-form">
                    <h2>New Project</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="project_name">
                        <label>Project Name</label>
                        <input
                            type="text"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            placeholder="Project Name"
                        />
                    </div>
                    <div className="description">
                        <label>Description</label>
                        <input
                            type="text"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder="Description"
                        />
                    </div>
                    <div className="dates">
                        <div className="start_date">
                            <label>Starts at</label>
                            <input
                                type="date"
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Start Date"
                                value={startDate}
                            />
                        </div>
                        <div className="deadline">
                            <label>Deadline</label>
                            <input
                                type="date"
                                onChange={(e) => setDeadline(e.target.value)}
                                placeholder="Deadline"
                                value={deadline}
                            />
                        </div>
                        <div className="estimate">
                            <label>Estimation</label>
                            <input
                                type="number"
                                onChange={(e) => setEstimation(e.target.value)}
                                placeholder="How many days"
                                value={estimation}
                            />
                        </div>
                    </div>
                    <div className="status-priority">
                        <div className="status">
                            <label>Status</label>
                            <select className="drops" value={projectStatus} onChange={handleStatus} aria-label="Default select example">

                                <option selected>select Status</option>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Cancelled">Cancelled</option>
                            </select >
                        </div>
                        <div className="priority">
                            <label>Priority</label>
                            <select className="drops" value={priority} onChange={handlePriority} aria-label="Default select example">

                                <option selected>Select Priority</option>
                                <option value="low">low</option>
                                <option value="medium">medium</option>
                                <option value="high">high</option>
                            </select >
                        </div>
                    </div>
                    <div className="assignees">
                        <label>Assignees</label>
                        <Select
                            multiple
                            value={assignees}
                            onChange={(e) => setAssignees(e.target.value)}
                            placeholder="Select Assignees"
                            className="assign"
                            renderValue={(selected) => (
                                <div>
                                    {selected.map((value) => (
                                        <Chip
                                            key={value}
                                            label={users.find(user => user._id === value)?.fullName || ''}
                                            sx={{
                                                backgroundColor: '#ccccff',  
                                                borderRadius: "10px", 
                                                margin: '2px', 
                                                padding: '2px 6px', 
                                                color: '#7c7cfc'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        >
                            {users.map((user) => (
                                <MenuItem key={user._id} value={user._id}


                                >
                                    {user.fullName}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <button>Create Project</button>
                    {error && <div className="error">{error}</div>}
                </form>
                {showAlert && (
                    <div className="alert">
                        Project created successfully!
                    </div>
                )}

            </div>

        </Modal>
    );
}

export default AddNewProject;