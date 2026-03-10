import { useState, useEffect } from "react";
import {
  fetchPopularMovies,
  searchMovies,
  discoverMovies,
  fetchGenres,
} from "../../services/api";
import MovieCard from "../../components/MovieCard/MovieCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Filters from "../../components/Filters/Filters";
import Loader from "../../components/Loader/Loader";
import Pagination from "../../components/Pagination/Pagination";
import "./Home.css";

export default function Home() {
  // Estados
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  // Cargar géneros al inicio
  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  // Cargar películas cuando cambien los filtros o página
  useEffect(() => {
    loadMovies();
  }, [currentPage, searchQuery, selectedGenre, sortBy]);

  const loadMovies = async () => {
    setLoading(true);

    try {
      let data;

      if (searchQuery) {
        // Búsqueda por texto
        data = await searchMovies(searchQuery, currentPage);
      } else if (selectedGenre || sortBy !== "popularity.desc") {
        // Filtros activos
        data = await discoverMovies({
          page: currentPage,
          genreId: selectedGenre,
          sortBy: sortBy,
        });
      } else {
        // Películas populares por defecto
        data = await fetchPopularMovies(currentPage);
      }

      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error cargando películas:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    // Limpiar filtros al buscar
    if (query) {
      setSelectedGenre("");
      setSortBy("popularity.desc");
    }
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
    setSearchQuery(""); // Limpiar búsqueda al filtrar
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
    setSearchQuery(""); // Limpiar búsqueda al ordenar
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Título dinámico
  const getTitle = () => {
    if (searchQuery) return `Resultados para "${searchQuery}"`;
    if (selectedGenre) {
      const genre = genres.find((g) => g.id === parseInt(selectedGenre));
      return genre ? `Películas de ${genre.name}` : "Películas";
    }
    return "Películas Populares";
  };

  return (
    <main className="home">
      <div className="container">
        {/* Hero Section */}
        <section className="home-hero">
          <h1 className="home-title">
            Descubre el <span className="text-gradient">Cine</span>
          </h1>
          <p className="home-subtitle">
            Explora miles de películas, encuentra tus favoritas y descubre nuevas joyas del séptimo arte
          </p>
        </section>

        {/* Search Bar */}
        <section className="home-search">
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* Filters */}
        {!searchQuery && (
          <section className="home-filters">
            <Filters
              genres={genres}
              selectedGenre={selectedGenre}
              onGenreChange={handleGenreChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </section>
        )}

        {/* Results Section */}
        <section className="home-results">
          <div className="results-header">
            <h2 className="results-title">{getTitle()}</h2>
            {!loading && (
              <span className="results-count">
                {movies.length} películas en esta página
              </span>
            )}
          </div>

          {loading ? (
            <Loader />
          ) : movies.length > 0 ? (
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
          ) : (
            <div className="no-results">
              <span className="no-results-icon">🎬</span>
              <h3>No se encontraron películas</h3>
              <p>Intenta con otros términos de búsqueda o filtros</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
