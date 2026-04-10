import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await client.post("/auth/login", { email, password });
      login(response.data.token);
      toast.success("Bienvenido!");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.error || "Error al iniciar sesion";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-5 col-lg-4">
          <div className="card p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-light">PMS</h2>
              <p className="text-secondary">Project Management System</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Iniciando...
                  </>
                ) : (
                  "Iniciar Sesion"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-secondary">¿No tienes cuenta? </span>
              <Link to="/register" className="text-primary text-decoration-none">
                Registrate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;