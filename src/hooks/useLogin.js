import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState("")
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setLoading(true)
        setError(null)
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        const json = await response.json()
        if (!response.ok) {
            setLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            //save admni to local storage 
            localStorage.setItem("token", JSON.stringify(json))

            //update authentication context
            const getUser = async () => {
                const res = await fetch("/api/Acm_CRM/", {
                    headers: { "Authorization": `Bearer ${json.token}` }
                });

                const user = await res.json();
                dispatch({ type: 'LOGIN', payload: user })
            }
            getUser()


            //update loading state
            setLoading(false)
        }

    }
    return { login, loading, error }
}