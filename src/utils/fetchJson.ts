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
  const isProd = window.location.pathname.startsWith('/showtime');
  const finalUrl = isProd ? `/showtime${url}` : url;

  const response = await fetch(finalUrl, options);

  if (!response.ok) {
    // Försök hämta det riktiga felmeddelandet från backend ("A user is already logged in")
    let errorMsg = `Server error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch {
      // Om bodyn inte var JSON, använd statusText
      errorMsg = response.statusText || errorMsg;
    }

    console.error(`Fetch error: ${response.status} - ${errorMsg}`);

    // VIKTIGT: Vi kastar felet istället för att returnera det!
    const error = new Error(errorMsg);
    (error as any).status = response.status;
    throw error;
  }

  try {
    return await response.json();
  } catch (err) {
    console.error("Kunde inte tolka JSON: ", err);
    throw new Error("Invalid JSON response from server");
  }
}

    // Wait for the the backend to return data when we
    // call the REST-api asking for a list of all animals
    

    // Wait for the browser to unpack/de-serialize the json
    // in the resposne to data we can work with
    // let data = await response.json();

    // return data;
