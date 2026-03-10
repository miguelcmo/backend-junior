const API_BASE = "https://api.themoviedb.org/3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZDdmNTA3MWNiMjA4NTEyMWE4NGYyNzlhNjRlNDQ2YyIsIm5iZiI6MTcxMzM4OTkyMi45NzIsInN1YiI6IjY2MjA0MTYyZWNhZWY1MDEzMGY4ODA5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q94-KgwyIABGFLz8nJ9IfqHzhzBN8nZsxOsOKGOvIJs",
  },
};

// Películas populares
export async function fetchPopularMovies(page = 1) {
  const res = await fetch(
    `${API_BASE}/movie/popular?page=${page}`,
    options
  );
  const data = await res.json();
  return data;
}

// Detalle de película
export async function fetchMovieDetail(id) {
  const res = await fetch(
    `${API_BASE}/movie/${id}`,
    options
  );
  return await res.json();
}

// Buscar películas por título
export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${API_BASE}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
    options
  );
  const data = await res.json();
  return data;
}

// Obtener lista de géneros
export async function fetchGenres() {
  const res = await fetch(
    `${API_BASE}/genre/movie/list`,
    options
  );
  const data = await res.json();
  return data.genres;
}

// Descubrir películas con filtros
export async function discoverMovies({ page = 1, genreId = "", sortBy = "popularity.desc" }) {
  let url = `${API_BASE}/discover/movie?page=${page}&sort_by=${sortBy}`;

  if (genreId) {
    url += `&with_genres=${genreId}`;
  }

  const res = await fetch(url, options);
  const data = await res.json();
  return data;
}

// Películas mejor valoradas
export async function fetchTopRated(page = 1) {
  const res = await fetch(
    `${API_BASE}/movie/top_rated?page=${page}`,
    options
  );
  const data = await res.json();
  return data;
}

// Próximos estrenos
export async function fetchUpcoming(page = 1) {
  const res = await fetch(
    `${API_BASE}/movie/upcoming?page=${page}`,
    options
  );
  const data = await res.json();
  return data;
}

// En cartelera
export async function fetchNowPlaying(page = 1) {
  const res = await fetch(
    `${API_BASE}/movie/now_playing?page=${page}`,
    options
  );
  const data = await res.json();
  return data;
}
