import { createContext, useReducer, } from "react";

export const ProjectsContext = createContext()
export const ProjectsReducer = (state, action) => {
    switch (action.type) {
        case "GET_PROJECTS":
            return { projects: action.payload }
        case "CREATE_PROJECTS":
            return { projects: [action.payload, ...state.projects] }
        case "UPDATE_PROJECT":
            return {
                projects: state.projects.map(project =>
                    project._id === action.payload._id? action.payload : project
                )
            };
        case 'DELETE_PROJECT':
            return {
                projects: state.projects.filter((project) => project._id !== action.payload._id)
            }
        default:
            return state
    }
}
export const ProjectsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ProjectsReducer, {
        projects: []
    })


    return (
        <ProjectsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ProjectsContext.Provider>
    )

}