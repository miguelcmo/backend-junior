const LoadingSpinner = ({ text = "Cargando..." }) => {
  return (
    <div className="spinner-container">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;