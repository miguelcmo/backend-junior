import { Link } from "react-router-dom";
import "./MovieCard.css";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const IMG_PLACEHOLDER = "https://via.placeholder.com/500x750?text=No+Image";

export default function MovieCard({ movie }) {
  const imageUrl = movie.poster_path
    ? IMG_BASE + movie.poster_path
    : IMG_PLACEHOLDER;

  // Formatear puntuación a 1 decimal
  const rating = movie.vote_average?.toFixed(1) || "N/A";

  // Obtener año de estreno
  const year = movie.release_date?.split("-")[0] || "N/A";

  // Color del badge según puntuación
  const getRatingClass = () => {
    const score = movie.vote_average;
    if (score >= 7) return "rating-high";
    if (score >= 5) return "rating-medium";
    return "rating-low";
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card-image">
        <img src={imageUrl} alt={movie.title} loading="lazy" />
        <div className={`movie-card-rating ${getRatingClass()}`}>
          ⭐ {rating}
        </div>
      </div>

      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <span className="movie-card-year">{year}</span>
      </div>

      <div className="movie-card-overlay">
        <span className="movie-card-view">Ver detalles</span>
      </div>
    </Link>
  );
}
