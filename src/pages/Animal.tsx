//change name on File? 

import fetchJson from '../utils/fetchJson';
import { useState, useEffect } from 'react';
import generate from "../utils/bookingNumberGeneratir";

AnimalPage.route = {
    path: '/Animals',
    index: -1
};



// adding a interface for screening
interface AnimalMovie {
    theaterName: string,
    totalAmountOfSeats: number,
    movieId: number,
    movieTitle: string,
    poster: string,
    movieDuration: number,
    startTime: string,
    endTime: string,
    screeningDate: string,
    avaliableSeats: number;
    availableSeats: number;
}

export default function AnimalPage() {

    const [animals, setAnimals] = useState<AnimalMovie[] | null>(null);

    // useEffect with an empty dependency array
    // run when the component mounts!
    useEffect(() => {
        // Since you can't give useEffect an async function
        // as argument we wrap our fetchJson, that needs await
        // inside a self-exucting anonymous function
        (async () => {
            setAnimals(await fetchJson('/api/v_screenings'));
        })();
    }, []);

    // use short-circuiting to just return null as long
    // as animals is null, but the whole jsx-structure once 
    // animals has a truthy value
    return animals && <>
        <h1>Movies: </h1>
        {animals.map(({ movieId, theaterName, movieTitle, availableSeats }) => <article key={movieId}>
            <h3>{movieTitle}</h3>
            <p>{movieTitle} in Theater: {theaterName}.</p>
            <p> Avaliable seats: {availableSeats} st.</p>
            <img src={`/images/posters/${movieId}.webp`} alt={movieTitle} />
            <p>{generate()}</p>
            <hr />
        </article>)}
    </>;
};