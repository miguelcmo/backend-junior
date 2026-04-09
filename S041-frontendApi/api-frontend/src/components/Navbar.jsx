import { useNavigate } from "react-router-dom"

const Navbar = () => {

    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
        <nav className="navbar navbar-dark py-3">
            <span className="navbar-brand">Project Management System Fontend-API</span>
            <button
                className="btn btn-outline-light"
                onClick={logout}
            >
                Logout
            </button>
        </nav>
    )
}

export default Navbar