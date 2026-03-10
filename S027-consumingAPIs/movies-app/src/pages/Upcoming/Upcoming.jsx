import { useState, useEffect } from "react";
import { fetchUpcoming } from "../../services/api";
import MovieCard from "../../components/MovieCard/MovieCard";
import Loader from "../../components/Loader/Loader";
import Pagination from "../../components/Pagination/Pagination";
import "./Upcoming.css";

export default function Upcoming() {
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
      const data = await fetchUpcoming(currentPage);
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
    <main className="upcoming-page">
      <div className="container">
        {/* Header */}
        <section className="page-header">
          <div className="page-header-icon">🎬</div>
          <h1 className="page-title">Próximos Estrenos</h1>
          <p className="page-subtitle">
            Las películas que llegarán próximamente a los cines
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
