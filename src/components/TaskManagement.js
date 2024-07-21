import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import "../styles/taskManagement.css";
import { TfiTimer } from "react-icons/tfi";
import { IconContext } from "react-icons";
import { useTasksContext } from '../hooks/useTasksContext';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { FaArrowUpLong } from "react-icons/fa6";
import { FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc";
import { HiCalendar } from "react-icons/hi";

const TaskManagement = () => {
    const { dispatch } = useTasksContext()
    const [isRunning, setIsRunning] = useState(false);
    const [value, setValue] = useState(0);
    const [description, setDescription] = useState("");
    const [taskProgress, setTaskProgress] = useState("");
    const [updatedProgress, setUpdatedProgress] = useState("")
    const [taskStatus, setTaskStatus] = useState("");
    const [taskName, setTaskName] = useState("");
    const [error, setError] = useState(null)
    const [project, setProject] = useState("")
    const [spentTime, setSpentTime] = useState("")
    const [estimation, setEstimation] = useState("")
    const [spentPercentage, setPercentage] = useState(0)
    const [priority, setPriority] = useState("")
    const [deadline, setDeadline] = useState("")
    const [start, setStart] = useState("")
    const [startTime, setStartTime] = useState(null);

    const { id } = useParams();
    //task info
    useEffect(() => {
        const fetchTask = async () => {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await fetch(`/api/Acm_CRM/Task/${id}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token.token}` }
            });
            const taskData = await response.json();
            if (response.ok) {
                setDescription(taskData.description);
                setTaskStatus(taskData.taskStatus);
                setTaskName(taskData.taskName);
                setProject(taskData.project);
                setSpentTime(taskData.timeSpent)
                setEstimation(taskData.estimation)
                setPriority(taskData.priority)
                setDeadline(formatDate(taskData.deadline))
                setStart(formatDate(taskData.startDate))
                setUpdatedProgress(taskData.taskProgress)
            }
        };
        fetchTask();
    }, []);
    //timer logic
    useEffect(() => {
        let interval = null;

        if (isRunning) {
            interval = setInterval(() => {
                setValue(Date.now() - startTime);
            }, 10);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isRunning, startTime]);

    const handleStart = () => {
        setIsRunning(true);
        setStartTime(Date.now() - value);
    };

    const displayTime = (totalMilliseconds) => {
        const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        const hours = Math.floor((totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000).toString().padStart(2, '0');
        return (
            <div className="showtime">
                {days}:{hours}:{minutes}:{seconds}
            </div>
        );
    };


    const displayTimeSpent = () => {
        const totalMilliseconds = Number(spentTime);
        const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24)).toString();
        const hours = Math.floor((totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();
        const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)).toString();
        const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000).toString();

        return (
            <div className="showtime-spent">
                {`${days}d ${hours}h ${minutes}m logged`}
            </div>
        );
    }
    function CircularDeterminate({ progress }) {
        return (
            <Stack sx={{ position: 'relative' }} spacing={2} direction="row">

                <CircularProgress sx={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }} variant="determinate" value={100} />
                <CircularProgress
                    variant="determinate"
                    sx={{
                        color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                        position: 'absolute',
                        right: 0
                    }}
                    value={progress}
                />
            </Stack>
        );
    }

    function formatDate(dateString) {
        // Create a Date object from the deadline string
        const date = new Date(dateString);

        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return formattedDate;
    }


    const saveTimeSpent = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        const response = await fetch(`/api/Acm_CRM/timeSpent/${id}`, {
            method: "POST",
            body: JSON.stringify({ timeSpent: value }),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token.token}`
            }

        });


        if (response.ok) {
            console.log("Time spent saved successfully");
            setIsRunning(false)
            setValue(0);
            setStartTime(null)
            setSpentTime((prevSpentTime) => (Number(prevSpentTime) + value).toString());

        } else {
            console.error("Error saving time spent");
        }
    };

    const token = JSON.parse(localStorage.getItem('token'));
    const handleSubmit = async (e) => {
        e.preventDefault();
        setTaskStatus(e.target.value);

        const task = {


            taskStatus: e.target.value

        };
        const response = await fetch(`/api/Acm_CRM/updateTaskProgress/${id}`, {
            method: "PATCH",
            body: JSON.stringify(task),
            headers: { "Authorization": `Bearer ${token.token}`, "Content-Type": "application/json" }

        });
        const json = await response.json();
        if (!response.ok) {
            setError(json.error);
        }

        if (response.ok) {

            dispatch({ type: 'UPDATE_TASK', payload: json.task })


        }
    };
    const handleProgress = async (e) => {
        e.preventDefault();

        const task = {


            taskProgress

        };
        const response = await fetch(`/api/Acm_CRM/updateTaskProgress/${id}`, {
            method: "PATCH",
            body: JSON.stringify(task),
            headers: { "Authorization": `Bearer ${token.token}`, "Content-Type": "application/json" }

        });
        const json = await response.json();
        if (!response.ok) {
            setError(json.error);
        }

        if (response.ok) {

            dispatch({ type: 'UPDATE_TASK', payload: json.task })
            setTaskProgress("")

            setUpdatedProgress(json.taskProgress);

        }
    };
    useEffect(() => {
        // Calculate the percentage only when spentTime and estimation are valid numbers
        if (!isNaN(Number(spentTime)) && !isNaN(Number(estimation))) {
            const estimationInMilliSec = Number(estimation) * 3600000;
            const spentPercentage = (Number(spentTime) / estimationInMilliSec) * 100;
            setPercentage(Number(spentPercentage.toFixed(2))); // Use toFixed to limit decimal places if necessary
        }
    }, [spentTime, estimation]);



    return (
        <div className="management">
            <Link className="link-tasks" to={`/employeeAccount/tasks/${project}`}>

                <div className="taskName-cont">
                    <IconContext.Provider value={{ className: "icn-back" }}>
                        <MdOutlineKeyboardBackspace />
                    </IconContext.Provider><h5 className="back">Back to Tasks</h5>

                </div>
            </Link>
            <div className="big-container">
                <div className="task-prog">
                    <div className="task-details">
                        <div>
                            <h4>Task Name : </h4>
                            <span style={{ margin: "0", borderRadius: "10px", backgroundColor: "white", padding: "10px" }}>{taskName}</span>
                        </div>
                        <div>
                            <h4 style={{ marginTop: '0' }}>Task Description : </h4>
                            <p className="tasks-description">{description}</p>
                        </div>
                        <div className="progress-task">
                            <h4 style={{ margin: '0' }}>Task Progress</h4>
                            <form className="form-progress"  >
                                <textarea
                                    className="task-progress"
                                    type="text"
                                    onChange={(e) => setTaskProgress(e.target.value)}
                                    value={taskProgress}
                                    placeholder="Description"
                                />

                                <button type="submit" className="submit-progress" onClick={handleProgress}>Submit</button>

                            </form>

                        </div>

                    </div>
                    <div className="prog">
                        <h4 style={{ margin: "0" }}>Progress</h4>
                        <ul className="progress-list" >
                            {updatedProgress && updatedProgress.split("\n").map((line, index) => (
                                <li key={index}>

                                    {line}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="stopwatch-container">
                    <div className="timer-box">

                        <div className="timer">

                            <IconContext.Provider value={{ className: "icn-timer" }}>
                                <TfiTimer />
                            </IconContext.Provider><h3>Timer</h3>

                        </div>
                        <div className="displaytime">
                            {displayTime(value)}
                        </div>
                        <div className="button-container">
                            <div>
                                {isRunning ? (
                                    <button
                                        className="stop-btn"
                                        type="button"
                                        color="error"
                                        onClick={() => setIsRunning(false)}
                                    >
                                        Stop
                                    </button>
                                ) : (
                                    <button
                                        className="start-btn"
                                        type="button"
                                        onClick={handleStart}
                                    >
                                        Start
                                    </button>
                                )}
                            </div>
                            <div>

                                <button
                                    className="save-btn"
                                    type="button"
                                    onClick={saveTimeSpent}
                                >
                                    Save
                                </button>

                            </div>
                        </div>
                    </div>
                    <div >
                        <h4>Time Tracking</h4>
                        <div className="tracking">
                            <div>

                                <CircularDeterminate progress={spentPercentage} />

                            </div>
                            <div className="track-spent">
                                <span style={{ fontSize: "18px" }} className="">{displayTimeSpent()}</span>
                                <span style={{ fontSize: "13px", color: "#91929E" }} className="">{`Original Estimate ${estimation}h`}</span>
                            </div>
                        </div>
                    </div>
                    <div className="status">
                        <h4 style={{ margin: "0" }}>Status</h4>
                        <select className="drops" value={taskStatus} onChange={handleSubmit} aria-label="Default select example"  >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Cancelled">Cancelled</option>
                        </select >
                    </div>

                    <div className="another-one">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <h4 style={{ margin: "0" }}>Priority</h4>
                            <div className={priority === "low" ? "priority-low" : priority === "medium" ? "priority-medium" : priority === "high" ? "priority-high" : ""}>
                                {priority === "low" &&
                                    <IconContext.Provider style={{ padding: "0" }} value={{ className: "icn" }}><FcLowPriority /></IconContext.Provider>}
                                {priority === "medium" &&
                                    <IconContext.Provider value={{ className: "icn" }}><FcMediumPriority /></IconContext.Provider>}
                                {priority === "high" &&
                                    <IconContext.Provider value={{ className: "icn" }}><FcHighPriority /></IconContext.Provider>}
                                {priority}
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <h4 style={{ margin: "0" }}>Dead Line</h4>
                            <div>{deadline}</div>
                        </div>
                    </div>

                    <div className="calen">

                        <IconContext.Provider value={{ className: "icn-timer" }}>
                            <HiCalendar />
                        </IconContext.Provider><h4 style={{ margin: "0" }} >Created At</h4>
                        {start}

                    </div>



                </div>

            </div>
        </div>
    );
};

export default TaskManagement;
