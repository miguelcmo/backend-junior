import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/custom.css'
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;