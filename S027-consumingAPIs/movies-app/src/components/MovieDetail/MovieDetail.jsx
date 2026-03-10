import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieDetail } from "../../services/api";
import Loader from "../Loader/Loader";
import "./MovieDetail.css";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMovieDetail(id)
      .then(setMovie)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;

  if (!movie) return <p className="error-message">No se encontró la película</p>;

  // Formatear duración
  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  // Formatear fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Formatear presupuesto/recaudación
  const formatMoney = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="movie-detail">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div
          className="movie-detail-backdrop"
          style={{
            backgroundImage: `url(${BACKDROP_BASE}${movie.backdrop_path})`,
          }}
        />
      )}

      <div className="movie-detail-content">
        {/* Botón volver */}
        <Link to="/" className="back-button">
          ← Volver
        </Link>

        <div className="movie-detail-main">
          {/* Poster */}
          <div className="movie-detail-poster">
            <img
              src={movie.poster_path ? IMG_BASE + movie.poster_path : ""}
              alt={movie.title}
            />
          </div>

          {/* Info */}
          <div className="movie-detail-info">
            <h1 className="movie-detail-title">{movie.title}</h1>

            {movie.tagline && (
              <p className="movie-detail-tagline">"{movie.tagline}"</p>
            )}

            {/* Géneros */}
            <div className="movie-detail-genres">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="movie-detail-stats">
              <div className="stat">
                <span className="stat-icon">⭐</span>
                <span className="stat-value">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="stat-label">
                  ({movie.vote_count} votos)
                </span>
              </div>

              <div className="stat">
                <span className="stat-icon">🕐</span>
                <span className="stat-value">{formatRuntime(movie.runtime)}</span>
              </div>

              <div className="stat">
                <span className="stat-icon">📅</span>
                <span className="stat-value">{formatDate(movie.release_date)}</span>
              </div>
            </div>

            {/* Sinopsis */}
            <div className="movie-detail-section">
              <h2>Sinopsis</h2>
              <p className="movie-detail-overview">
                {movie.overview || "Sin descripción disponible."}
              </p>
            </div>

            {/* Info adicional */}
            <div className="movie-detail-extra">
              <div className="extra-item">
                <span className="extra-label">Presupuesto</span>
                <span className="extra-value">{formatMoney(movie.budget)}</span>
              </div>

              <div className="extra-item">
                <span className="extra-label">Recaudación</span>
                <span className="extra-value">{formatMoney(movie.revenue)}</span>
              </div>

              <div className="extra-item">
                <span className="extra-label">Estado</span>
                <span className="extra-value">{movie.status || "N/A"}</span>
              </div>

              <div className="extra-item">
                <span className="extra-label">Idioma original</span>
                <span className="extra-value">
                  {movie.original_language?.toUpperCase() || "N/A"}
                </span>
              </div>
            </div>

            {/* Productoras */}
            {movie.production_companies?.length > 0 && (
              <div className="movie-detail-section">
                <h2>Productoras</h2>
                <div className="production-companies">
                  {movie.production_companies.map((company) => (
                    <span key={company.id} className="company-tag">
                      {company.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
