import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, MenuItem, Chip } from '@mui/material';
import { useProjectsContext } from '../hooks/useProjectsContext';

const EditProject = () => {

    const { id } = useParams();
    const [title, setTitle] = useState("")
    const [error, setError] = useState(null)
    const [description, setDescription] = useState("")
    const [projectStatus, setProjectStatus] = useState("")
    const [priority, setPriority] = useState("")
    const [estimation, setEstimation] = useState("")
    const [startDate, setStartDate] = useState("")
    const [deadline, setDeadline] = useState("")
    const [assignees, setAssignees] = useState([])
    const [isEditMode, setIsEditMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const token = JSON.parse(localStorage.getItem('token'));
    const { dispatch } = useProjectsContext()
    useEffect(() => {
        const fetchProject = async () => {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await fetch(`/api/Acm_CRM/Project/${id}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token.token}` }
            });
            const projectData = await response.json();
            if (response.ok) {
                const startDateFormatted = new Date(projectData.startDate).toISOString().split('T')[0];
                const deadlineFormatted = new Date(projectData.deadline).toISOString().split('T')[0];

                setTitle(projectData.title);
                setDescription(projectData.description);
                setProjectStatus(projectData.projectStatus);
                setPriority(projectData.priority);
                setEstimation(projectData.estimation);
                setStartDate(startDateFormatted);
                setDeadline(deadlineFormatted);
                setAssignees(projectData.assignees);
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
        fetchProject();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
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
        const response = await fetch(`/api/Acm_CRM/updateProjects/${id}`, {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${token.token}`, "Content-Type": "application/json" },
            body: JSON.stringify(project),
        });
        const json = await response.json();
        if (!response.ok) {
            setError(json.error);
        }

        if (response.ok) {
            dispatch({ type: 'UPDATE_PROJECT', payload: json?.project })
            setIsEditMode(false)
            setSuccessMessage("Updated successfully")
            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
        }
    };
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };
    const handleStatus = (event) => {
        setProjectStatus(event.target.value);
    };
    const handlePriority = (event) => {
        setPriority(event.target.value);
    };
    const [users, setUsers] = useState([]);
    const handleCancel = () => {
        setError(null)
        setIsEditMode(false);
    };
    const handleUpdate = () => {
        setIsEditMode(true);
    };
    return (
        <div className="project-form">

            <div className="title-form">
                <h2>Edit Project</h2>
            </div>
            <form >
                <div className="project_name">
                    <label>Project Name</label>
                    <input
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}

                        disabled={!isEditMode}
                    />
                </div>
                <div className="description">
                    <label>Description</label>
                    <input
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        placeholder="Description"
                        disabled={!isEditMode}
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
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="deadline">
                        <label>Deadline</label>
                        <input
                            type="date"
                            onChange={(e) => setDeadline(e.target.value)}
                            placeholder="Deadline"
                            value={deadline}
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="estimate">
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
                        <select className="drops" value={projectStatus} onChange={handleStatus} aria-label="Default select example" disabled={!isEditMode}>

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
                        <select className="drops" value={priority} onChange={handlePriority} aria-label="Default select example" disabled={!isEditMode}>

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
                        disabled={!isEditMode}
                        renderValue={(selected) => (
                            <div>
                                {selected.map((value, index) => (
                                    <Chip
                                        key={index}
                                        label={users.find(user => user._id === value)?.fullName}
                                        sx={{
                                            backgroundColor: '#ccccff',
                                            borderRadius: "10px",
                                            margin: '2px',
                                            padding: '2px 6px',
                                            color: '#000000'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    >
                        {users.map((user) => (
                            <MenuItem key={user._id} value={user._id} >
                                {user.fullName}
                            </MenuItem>
                        ))}
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

export default EditProject;