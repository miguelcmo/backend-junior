import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Contador: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Incrementar
            </button>
        </div>
    );
}