import { useState, useEffect } from "react";
import { getCharacters } from "../services/api";
import CharacterCard from "../components/CharacterCard";

function Home() {
    const [characters, setCharacters] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                setLoading(true);
                const data = await getCharacters(page);
                setCharacters(data.results);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, [page]);

    const filteredCharacters = characters.filter((character) =>
        character.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>

            <h1>Simpsons Characters</h1>
            <input
                type="text"
                placeholder="Buscar personaje..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading && <p>Cargando personajes...</p>}

            <div className="grid">
                {filteredCharacters.map((character) => (
                    <CharacterCard
                        key={character.id}
                        character={character}
                    />
                ))}
            </div>

            <div className="pagination">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <span>Page {page}</span>
                <button
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Home;