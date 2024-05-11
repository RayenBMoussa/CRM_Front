import { useAuthContext } from "../hooks/useAuthContext";
import { useTasksContext } from "../hooks/useTasksContext";
import EmployeeTaskList from "../components/EmployeeTaskList";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const EmployeeTasks = () => {
    const { tasks, dispatch } = useTasksContext()
    const { user } = useAuthContext()
    const { id } = useParams();
    useEffect(() => {
        const fetchEmployeeTasks = async () => {
            const token = JSON.parse(localStorage.getItem("token"))
            const response = await fetch(`/api/Acm_CRM/MyTasks/${id}`, {
                headers: { "Authorization": `Bearer ${token.token}` }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: "GET_TASKS", payload: json })

            }
        }
        fetchEmployeeTasks()
    }, [dispatch])
    console.log(tasks);
    const employeeTasks= tasks.filter((task)=>{
        // console.log(task.assignee);
        return task.assignee===user._id}
)
    return (
        <div className="containerr">
            <div className="nd-line">
                <h3 className="project">Tasks</h3>
            </div>
            <div className="nd-containerr">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>Task Name</th>
                            <th>Start Date</th>
                            <th>Estimation</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeTasks?.map((task) => (
                            <EmployeeTaskList key={task._id} task={task} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


export default EmployeeTasks;