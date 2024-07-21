
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { IoMdClose } from "react-icons/io";
import { IconContext } from "react-icons";
import "../styles/newProjectForm.css"
import { Select, MenuItem, Chip } from '@mui/material';
import { useTasksContext } from "../hooks/useTasksContext";
import "../styles/newTask.css"

const AddNewTask = ({ open, handleClose }) => {
    const { dispatch } = useTasksContext()

    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [taskStatus, setTaskStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [estimation, setEstimation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [deadline, setDeadline] = useState("");
    const [assignee, setAssignee] = useState("");
    const [project, setProject] = useState("")
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // const isoDateString = birthday_date ? birthday_date.toISOString() : null;
        const task = {
            taskName,
            description,
            taskStatus,
            priority,
            estimation,
            startDate,
            deadline,
            assignee,
            project
        };

        const token = JSON.parse(localStorage.getItem('token'));
        const response = await fetch("/api/Acm_CRM/newTask", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token.token}`, "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
        const json = await response.json();
        if (!response.ok) {
            setError(json.error);
        }



        if (response.ok) {
            dispatch({ type: 'CREATE_TASKS', payload: json.task })
            resetForm();
            handleClose(); // Close the modal
            setShowAlert(true);

            console.log(task);
        }


    };
    const handleStatus = (event) => {
        setTaskStatus(event.target.value);
    };
    const handlePriority = (event) => {
        setPriority(event.target.value);
    };
    const handleProject = (event) => {
        setProject(event.target.value);

    };
    useEffect(() => {
        console.log(project);
    }, [project])
    const resetForm = () => {
        setTaskName("");
        setDescription("");
        setTaskStatus("");
        setPriority("");
        setStartDate("");
        setDeadline("");
        setEstimation("");
        setProject("");
        setAssignee("");
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

    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const fetchProjects = async () => {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await fetch("/api/Acm_CRM/Projects", {
                headers: { "Authorization": `Bearer ${token.token}` }
            });
            const json = await response.json();
            if (response.ok) {
                setProjects(json);
            }
        };
        fetchProjects();
    }, []);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='modal-list'
            style={{
                outline: "none"
            }}
        >
            <div className="list-form">
                <IconContext.Provider value={{ className: "close-modal" }}>
                    <IoMdClose onClick={handleClose} />
                </IconContext.Provider>
                <div className="taskName-form">
                    <h2>New Task</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="task_name">
                        <div>
                            <label>Task Name</label>
                            <input
                                type="text"
                                onChange={(e) => setTaskName(e.target.value)}
                                value={taskName}
                                placeholder="Task Name"
                            />
                        </div>
                        <div>
                            <label>Associated with:</label>
                            <select className="drops" value={project} onChange={handleProject} aria-label="Default select example">
                                <option selected>Select project</option>
                                {projects?.map((project, index) => (
                                    <option key={index} value={project._id}>
                                        {project.title}
                                        
                                    </option>
                                ))}
                            </select >
                        </div>
                    </div>
                    <div className="task-description">
                        <label>Description</label>
                        <textarea
                            type="text"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder="Description"
                        />
                    </div>
                    <div className="task-dates">
                        <div className="start_date">
                            <label>Starts at</label>
                            <input
                                type="date"
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Start Date"
                                value={startDate}
                            />
                        </div>
                        <div className="task-deadline">
                            <label>Deadline</label>
                            <input
                                type="date"
                                onChange={(e) => setDeadline(e.target.value)}
                                placeholder="Deadline"
                                value={deadline}
                            />
                        </div>
                        <div className="task-estimate">
                            <label>Estimation</label>
                            <input
                                type="number"
                                min="1"
                                onChange={(e) => setEstimation(e.target.value)}
                                placeholder="How many days"
                                value={estimation}
                            />
                        </div>
                    </div>
                    <div className="status-priority">
                        <div className="status">
                            <label>Status</label>
                            <select className="drops" value={taskStatus} onChange={handleStatus} aria-label="Default select example">

                                <option selected>select Status</option>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Cancelled">Cancelled</option>
                            </select >
                        </div>
                        <div className="task-priority">
                            <label>Priority</label>
                            <select className="drops" value={priority} onChange={handlePriority} aria-label="Default select example">

                                <option selected>Select Priority</option>
                                <option value="low">low</option>
                                <option value="medium">medium</option>
                                <option value="high">high</option>
                            </select >
                        </div>
                    </div>
                    <div className="assignee">
                        <label>Assignee</label>
                        <Select
                            
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            placeholder="Select Assignees"
                            className="assign"
                            renderValue={(selected) => (
                                
                                <Chip
                                    
                                    label={users.find(user => user._id === selected)?.fullName || ''}
                                    sx={{
                                        backgroundColor: '#ccccff',
                                        borderRadius: "10px",
                                        margin: '2px',
                                        padding: '2px 6px',
                                        color: '#7c7cfc'
                                    }}
                                />
                            )}


                        >
                            {projects.find(p => p._id === project)?.assignees?.map(userId =>
                                users.map((user,index) => {
                                    if (user._id === userId)
                                        return (
                                            <MenuItem key={index} value={user._id}
                                            >
                                                {user.fullName}
                                            </MenuItem>
                                        )
                                })
                            )}
                        </Select>
                    </div>
                    <button>Create Task</button>
                    {error && <div className="error">{error}</div>}
                </form>
                {showAlert && (
                    <div className="alert">
                        Task created successfully!
                    </div>
                )}

            </div>

        </Modal>
    );
}

export default AddNewTask;