import "./Filters.css";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Más populares" },
  { value: "popularity.asc", label: "Menos populares" },
  { value: "vote_average.desc", label: "Mejor valoradas" },
  { value: "vote_average.asc", label: "Peor valoradas" },
  { value: "release_date.desc", label: "Más recientes" },
  { value: "release_date.asc", label: "Más antiguas" },
];

export default function Filters({
  genres,
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="filters">
      {/* Filtro por género */}
      <div className="filter-group">
        <label className="filter-label">Género</label>
        <select
          className="filter-select"
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
        >
          <option value="">Todos los géneros</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ordenar por */}
      <div className="filter-group">
        <label className="filter-label">Ordenar por</label>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
