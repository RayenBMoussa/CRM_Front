import { createContext, useReducer, useEffect } from "react"

export const AuthContext = createContext()
export const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload, loading: false }
        case "LOGOUT":
            return { user: null, loading: false }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, {
        user: null, loading: true
    })
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        if (token) {
            const getUser = async () => {
                const res = await fetch("/api/Acm_CRM/", {
                    headers: { "Authorization": `Bearer ${token.token}` }
                });

                const user = await res.json();
                
                dispatch({ type: 'LOGIN', payload: user })
            }
            
            getUser()
        }
        else{
            dispatch({ type: 'LOGOUT' })
        }
    }, [])



    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )

}