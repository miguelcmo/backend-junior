//import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    //const navigate = useNavigate()

    // const logout = () => {
    //     localStorage.removeItem("token")
    //     navigate("/")
    // }
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-dark py-3">
            <span className="navbar-brand">Project Management System Fontend-API</span>
            <span className="text-light me-3">
                {console.log("USER:", user)}
                {user?.email} ({user?.role})
            </span>
            <button
                className="btn btn-outline-light"
                onClick={handleLogout}
            >
                Logout
            </button>
        </nav>
    )
}

export default Navbar