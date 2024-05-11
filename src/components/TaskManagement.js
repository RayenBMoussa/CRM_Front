import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import "../styles/taskManagement.css";

const TaskManagement = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [value, setValue] = useState(0);
    const [description, setDescription] = useState("");
    const [taskStatus, setTaskStatus] = useState("");
    const [taskName, setTaskName] = useState("");
    const { id } = useParams();

    useEffect(() => {
        let interval = null;

        if (isRunning) {
            interval = setInterval(() => {
                setValue((prevState) => prevState + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isRunning]);

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
            }
        };
        fetchTask();
    }, []);

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
            setValue(0);
        } else {
            console.error("Error saving time spent");
        }
    };

    return (
        <div className="management">
            <div className="taskName-cont">
                <h4 className="taskName">{taskName}</h4>
            </div>
            <div className="stopwatch-container">
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
                                onClick={() => setIsRunning(true)}
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
        </div>
    );
};

export default TaskManagement;
