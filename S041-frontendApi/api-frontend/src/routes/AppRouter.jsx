import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import PrivateRoute from "./PrivateRoute"
import Tasks from "../pages/Tasks"

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path = "/"
                    element = {<Login />}
                >    
                </Route>
                <Route
                    path = "/dashboard"
                    element = {
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                > 
                </Route>
                <Route
                    path = "/tasks/:projectId"
                    element = {
                        <PrivateRoute>
                            <Tasks />
                        </PrivateRoute>
                    }
                > 
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter