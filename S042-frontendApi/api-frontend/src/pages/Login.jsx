import { useState } from "react"
import client from "../api/client"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await client.post("/auth/login", {
                email,
                password
            })

            const token = response.data.token
            
            //localStorage.setItem("token", token)
            login(token)
            
            navigate("/dashboard")
            
            alert("Login exitoso")

        } catch (error) {

            alert("Error en login: " + error.message)

        }
    }


    return (
        <div className="container vh-100 d-flex align-items-center justify-content-center">
            <div className="card card-custom p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-4"> Login</h3>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="">Email</label>
                        <input 
                            type="email" 
                            className="form-control"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="">Password</label>
                        <input 
                            type="password" 
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-primary w-100">Login</button>

                </form>

            </div>

        </div>
    )
}

export default Login