const BASE_URL = "https://thesimpsonsapi.com/api/characters";
const IMG_URL = "https://cdn.thesimpsonsapi.com";

export const getCharacters = async (page = 1) => {
  const response = await fetch(`${BASE_URL}?page=${page}`);

  if (!response.ok) {
    throw new Error("Error fetching characters");
  }

  return await response.json();
};

export const getCharacter = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Error fetching character");
  }

  return await response.json();
};

export const getImage = (path, size = 200) => {
  return `${IMG_URL}/${size}${path}`;
};