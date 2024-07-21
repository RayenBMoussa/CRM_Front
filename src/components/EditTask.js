import { useEffect, useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useParams } from 'react-router-dom';
import { Select, MenuItem, Chip } from '@mui/material';
const EditTask = () => {
    const { id } = useParams();
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [taskStatus, setTaskStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [estimation, setEstimation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [deadline, setDeadline] = useState("");
    const [assignee, setAssignee] = useState("");
    const [project, setProject] = useState("")
    const [error, setError] = useState(null)
    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const token = JSON.parse(localStorage.getItem('token'));
    const { dispatch } = useTasksContext()
    useEffect(() => {
        const fetchTask = async () => {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await fetch(`/api/Acm_CRM/Task/${id}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token.token}` }
            });
            const taskData = await response.json();
            if (response.ok) {
                const startDateFormatted = new Date(taskData.startDate).toISOString().split('T')[0];
                const deadlineFormatted = new Date(taskData.deadline).toISOString().split('T')[0];

                setTaskName(taskData.taskName);
                setDescription(taskData.description);
                setTaskStatus(taskData.taskStatus);
                setPriority(taskData.priority);
                setEstimation(taskData.estimation);
                setStartDate(startDateFormatted);
                setDeadline(deadlineFormatted);
                setAssignee(taskData.assignee);
                setProject(taskData.project)
            }
            const responseUser = await fetch("/api/Acm_CRM/employees", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token.token}` }

            })
            const json = await responseUser.json()
            if (responseUser.ok) {
                setUsers(json);
            }

        };
        fetchTask();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
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
        const response = await fetch(`/api/Acm_CRM/updateTasks/${id}`, {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${token.token}`, "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
        const json = await response.json();
        if (!response.ok) {

            setError(json.error);


        }

        if (response.ok) {
            dispatch({ type: 'UPDATE_TASK', payload: json.task })
            setIsEditMode(false)
            setError(null)
            setSuccessMessage("Updated successfully")
            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
        }
    };
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
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };
    const handleStatus = (event) => {
        setTaskStatus(event.target.value);
    };
    const handleProject = (event) => {
        setProject(event.target.value);

    };
    const handlePriority = (event) => {
        setPriority(event.target.value);
    };
    const handleCancel = () => {
        setError(null)
        setIsEditMode(false);
    };
    const handleUpdate = () => {
        setIsEditMode(true);
    };


    return (

        <div className="list-form">
            <div className="taskName-form">
                <h2>Edit Task</h2>
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
                            disabled={!isEditMode}
                        />
                    </div>
                    <div>
                        <label>Associated with:</label>
                        <select className="drops" value={project} onChange={handleProject} aria-label="Default select example" disabled={!isEditMode}>
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
                        disabled={!isEditMode}
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
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="task-deadline">
                        <label>Deadline</label>
                        <input
                            type="date"
                            onChange={(e) => setDeadline(e.target.value)}
                            placeholder="Deadline"
                            value={deadline}
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="task-estimate">
                        <label>Estimation</label>
                        <input
                            type="number"
                            onChange={(e) => setEstimation(e.target.value)}
                            placeholder="How many days"
                            value={estimation}
                            disabled={!isEditMode}
                        />
                    </div>
                </div>
                <div className="status-priority">
                    <div className="status">
                        <label>Status</label>
                        <select className="drops" value={taskStatus} onChange={handleStatus} aria-label="Default select example" disabled={!isEditMode}>

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
                        <select className="drops" value={priority} onChange={handlePriority} aria-label="Default select example" disabled={!isEditMode}>

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
                        disabled={!isEditMode}
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
                            users.map((user, index) => {
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
                <div className="line5">
                    {isEditMode ? (
                        <>
                            <button className="save" type="button" onClick={handleSubmit}>Save</button>
                            <button type="button" onClick={handleCancel}>Cancel</button>

                        </>
                    ) : (
                        <button type="button" onClick={handleUpdate}>Update</button>
                    )}
                </div>
                {successMessage && <div className="success">{successMessage}</div>}
                {error && <div className="error">{error}</div>}
            </form>

        </div>


    );
}

export default EditTask;