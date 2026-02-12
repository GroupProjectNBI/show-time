// import { useStateContext } from '../utils/useStateObject';
import { useState, useEffect } from "react";
import fetchJson from "../utils/fetchJson.ts";
import type { ITheater } from "../interfaces/Seats.ts";
import Chairs from "../parts/Chairs.tsx"
TestDelux.route = {
    path: '/test',
    menuLabel: 'details',
    index: 2
};


export default function TestDelux() {
    const [seatArray, setSeatArray] = useState<ITheater[] | null>(null);

    // useEffect with an empty dependency array
    // run when the component mounts!
    useEffect(() => {
        // Since you can't give useEffect an async function
        // as argument we wrap our fetchJson, that needs await
        // inside a self-exucting anonymous function
        (async () => {
            setSeatArray(await fetchJson('/api/Theater'));
        })();
    }, []);

    // an image component that automatically switches to black and white
    // by adding the css class 'bw' if bwImages is true in our context

    return seatArray && <>
        <h1>Hell o from parens</h1>
        <h2>Just some information about the first theater: </h2>
        {
            seatArray.map(({ seatsPerRow, id }) => (
                // 3. Använd parenteser () för implicit return i map
                <>
                    <article key={id}>
                        {
                            seatsPerRow.map((count) => (
                                <Chairs numberOfSeats={count} />
                            ))
                        }
                    </article>
                    <br />
                </>
            ))

        }
    </>
}