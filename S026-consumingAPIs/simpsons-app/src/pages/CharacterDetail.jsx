import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCharacter, getImage } from "../services/api";

function CharacterDetail() {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                setLoading(true);
                const data = await getCharacter(id);
                setCharacter(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [id]);

    if (loading) return <p>Cargando personaje...</p>;
    if (!character) return <p>Personaje no encontrado</p>;

    return (
        <div className="detail-container">

            <h1>{character.name}</h1>
            <img src={getImage(character.portrait_path)} alt={character.name} />
            <p><b>Edad:</b> {character.age}</p>
            <p><b>Genero:</b> {character.gender}</p>
            <p><b>Ocupación:</b> {character.occupation}</p>
            <p><b>Estado:</b> {character.status}</p>
            <h3>Frases</h3>
            <ul>
                {character.phrases.map((phrase, index) => (
                    <li key={index}>{phrase}</li>
                ))}
            </ul>
        </div>
    );
}

export default CharacterDetail;