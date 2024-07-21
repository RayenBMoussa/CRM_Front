import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { useAuthContext } from "../hooks/useAuthContext"
import { useNavigation } from "react-router-dom"
import "../styles/login.css"
import logImg from "../avatars&logos/loginBoy.png";
import "../styles/login.css"
import CompImg from "../avatars&logos/CompsLogo.png";
import { PiHandWavingBold } from "react-icons/pi";
import { IconContext } from "react-icons"
import TextField from '@mui/material/TextField';
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
        <div className="big-cont">
            <div className="login-left">
                <img src={logImg} alt='Logo' className="login-image" />
            </div>
            <div className="login" >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img style={{ width: "50px", height: "50px" }} src={CompImg} alt='Logo' />
                    <h2>Acm Marketing</h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ fontWeight: "lighter" }}>Welcome to Acm Marketing</h3>
                    <IconContext.Provider value={{ className: "comp-logo" }}>
                        <PiHandWavingBold />
                    </IconContext.Provider>
                </div>
                <p style={{ margin: "0", lineHeight: "1.5", color: "rgba(50, 71, 92, 0.6)" }}>Please sign-in to your account and start your day with motivation</p>
                <form className="login-form" onSubmit={handleLogin}>
                    <div>
                        <TextField
                            className="field"
                            Email
                            id="outlined-Email"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            label="Email"

                        />
                    </div>
                    <div>
                        <TextField
                            className="field"
                            Password
                            id="outlined-Password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            label="Password"

                        />
                    </div>
                    <button disabled={loading}>Log in</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default Login;