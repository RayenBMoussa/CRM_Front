import { useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProjectsContext } from "../hooks/useProjectsContext";
import EmployeeProjectList from "../components/EmployeeProjectList";
import "../styles/projectsEmployee.css"
const ProjectsEmployee = () => {
    const { projects, dispatch } = useProjectsContext()
    const { user } = useAuthContext()
    useEffect(() => {
        const fetchEmployeeProjects = async () => {
            const token = JSON.parse(localStorage.getItem("token"))
            const response = await fetch(`/api/Acm_CRM/MyProjects/${user._id}`, {
                headers: { "Authorization": `Bearer ${token.token}` }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: "GET_PROJECTS", payload: json })

            }
        }
        fetchEmployeeProjects()
    }, [dispatch])
    return (
        <div className="containerr">
            <div className="nd-line">
                <h3 className="project">Projects</h3>
            </div>
            <div className="nd-containerr">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>Project Name</th>
                            <th>Start Date</th>
                            <th>Estimation</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects?.map((project) => (
                            <EmployeeProjectList key={project._id} project={project} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProjectsEmployee;