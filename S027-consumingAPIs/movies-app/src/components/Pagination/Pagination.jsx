import "./Pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Limitar a máximo 500 páginas (límite de TMDB)
  const maxPages = Math.min(totalPages, 500);

  // Calcular rango de páginas a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(maxPages, start + showPages - 1);

    // Ajustar si estamos cerca del final
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (maxPages <= 1) return null;

  return (
    <div className="pagination">
      {/* Botón Primera Página */}
      <button
        className="pagination-btn pagination-nav"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title="Primera página"
      >
        ««
      </button>

      {/* Botón Anterior */}
      <button
        className="pagination-btn pagination-nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Anterior"
      >
        «
      </button>

      {/* Números de página */}
      <div className="pagination-numbers">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`pagination-btn pagination-number ${
              page === currentPage ? "active" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Botón Siguiente */}
      <button
        className="pagination-btn pagination-nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPages}
        title="Siguiente"
      >
        »
      </button>

      {/* Botón Última Página */}
      <button
        className="pagination-btn pagination-nav"
        onClick={() => onPageChange(maxPages)}
        disabled={currentPage === maxPages}
        title="Última página"
      >
        »»
      </button>

      {/* Info de página */}
      <span className="pagination-info">
        Página {currentPage} de {maxPages}
      </span>
    </div>
  );
}
