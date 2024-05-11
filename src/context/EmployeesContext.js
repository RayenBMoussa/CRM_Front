import { createContext, useReducer, } from "react";

export const EmployeesContext = createContext()
export const EmployeesReducer = (state, action) => {
    switch (action.type) {
        case "GET_EMPLOYEES":
            return { employees: action.payload }
        case "CREATE_EMPLOYEES":
            return { employees: [action.payload, ...state.employees] }
        case "UPDATE_EMPLOYEES":
            if (action.payload && action.payload.id !== undefined) {
                if (action.payload.id === null) {
                    // If id is null, append the new employee to the end of the array
                    return { employees: [...state.employees, action.payload] };
                } else {
                    // If id is not null, update the employee with the matching id
                    return {
                        employees: state.employees.map((emp) =>
                            emp.id === action.payload.id ? action.payload : emp
                        ),
                    };
                }
            } else {
                // Handle the case where action.payload is undefined or  doesn't have an id
                console.error('UPDATE_EMPLOYEES action payload is undefined or missing id');
                return state;
            }
        default:
            return state
    }
}

export const EmployeesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(EmployeesReducer, {
        employees: null
    })


    return (
        <EmployeesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </EmployeesContext.Provider>
    )

}