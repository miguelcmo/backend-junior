import { Link } from "react-router-dom";
import { getImage } from "../services/api";

function CharacterCard({ character }) {
    return (
        <Link to={`/character/${character.id}`} className="card">
            <img src={getImage(character.portrait_path)} />
            <h3>{character.name}</h3>
        </Link>
    );
}

export default CharacterCard;