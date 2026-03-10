import { useState, useEffect } from "react";
import { fetchTopRated } from "../../services/api";
import MovieCard from "../../components/MovieCard/MovieCard";
import Loader from "../../components/Loader/Loader";
import Pagination from "../../components/Pagination/Pagination";
import "./TopRated.css";

export default function TopRated() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadMovies();
  }, [currentPage]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await fetchTopRated(currentPage);
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error cargando películas:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="top-rated-page">
      <div className="container">
        {/* Header */}
        <section className="page-header">
          <div className="page-header-icon">⭐</div>
          <h1 className="page-title">Mejor Valoradas</h1>
          <p className="page-subtitle">
            Las películas con las mejores puntuaciones de todos los tiempos
          </p>
        </section>

        {/* Movies */}
        <section className="page-content">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="movies-grid">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
