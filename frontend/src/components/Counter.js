import React, { useState } from "react";

function Counter() {

    const [value, setValue] = useState(0);

    function increment() {
        setValue(value + 1);
    }

    function decrement() {
        setValue(value > 0 ? value - 1 : value - 0);
    }

    function reset() {
        setValue(0);
    }
    return (
        <div>
            <p>{value}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
};

export default Counter;