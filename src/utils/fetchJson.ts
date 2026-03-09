/*
   fetchJson(url, [options])

   if you're making a delete (/api/animals/1), options: {method: 'DELETE'}

   POST/PUT requires more option (because you are sending are request body)

   POST /api/animals

   {
     method: 'POST',
     headers: {'Content-Type': 'application/json' },
     body: JSON.stringify(data)
   }

   Read more:
   https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

*/


export default async function fetchJson(url: string, options = {}) {
  // Kolla om vi är i produktion genom att se om '/showtime/' finns i URL-fältet
  const isProd = window.location.pathname.startsWith('/showtime');
  const finalUrl = isProd ? `/showtime${url}` : url;

  return await fetch(finalUrl, options).then(a => a.json());
}

    // Wait for the the backend to return data when we
    // call the REST-api asking for a list of all animals
    

    // Wait for the browser to unpack/de-serialize the json
    // in the resposne to data we can work with
    // let data = await response.json();

    // return data;
