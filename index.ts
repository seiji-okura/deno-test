import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const port = 8080;

const handler = async (_req: Request): Promise<Response> => {
    const reqURL = new URL(_req.url);
    const pokemonNumber = reqURL.searchParams.get('number');
    console.log(`reqURL:${reqURL}`);
    let url = `https://pokeapi.co/api/v2/pokemon/${reqURL.toString().split('/').pop()}/`;
    if( pokemonNumber ){
        url = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`;
    }
    console.log(`pokemon url:${url}`);
    const result = await fetch(url, {
        headers:{
            accept:'application/json'
        }
    });

    console.log(`status:${result.status}`);
    console.log(`statusText:${result.statusText}`);
    console.log(`json:${result.json}`);
 
    let body = ( pokemonNumber ) ? 
        `<p>Not Found. number:${pokemonNumber}</p>`:
        `<p>Not Found. name:${reqURL.toString().split('/').pop()}</p>`  ;
    if( result.status === 200){
        const json = await result.json();
        body = `
        <p>Id: ${json['id']}</p>
        <p>Name: ${json['name']}</p>
        <img src='${json['sprites']['front_default']}' alt='${json['name']}'/>'
        <img src='${json['sprites']['back_default']}' alt='${json['name']}'/>'
        <img src='${json['sprites']['front_shiny']}' alt='${json['name']}'/>'
        <img src='${json['sprites']['back_shiny']}' alt='${json['name']}'/>'
        `
    }    



    return new Response(body,{
        status: result.status,
        headers:{
            'content-type': 'text/html'
        }
    });
};

serve(handler,{port});
