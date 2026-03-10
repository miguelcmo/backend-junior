import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <span className="loader-text">Cargando...</span>
      </div>
    </div>
  );
}
