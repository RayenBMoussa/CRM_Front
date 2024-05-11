import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { useAuthContext } from "../hooks/useAuthContext"
import { useNavigation } from "react-router-dom"
import "../styles/login.css"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login, loading, error } = useLogin()

    const handleLogin = async (e) => {
        e.preventDefault()
        await login(email, password)

    }
    if (loading) return (
        <div className="">
            Loading...
        </div>
    )
    return (
        <div className="login" >
            <h3 className="title">Log in</h3>
            <form className="login-form" onSubmit={handleLogin}>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <button disabled={loading}>Log in</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
}

export default Login;