import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Tasks from "../pages/Tasks"
import PrivateRoute from "./PrivateRoute"

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
                    element={
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