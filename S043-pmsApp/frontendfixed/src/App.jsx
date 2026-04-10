import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155'
          }
        }}
      />
      <AppRouter />
    </AuthProvider>
  );
}

export default App;