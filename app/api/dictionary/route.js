import axios from 'axios';

export async function POST(request) {
  const { term } = await request.json();

  if (!term) {
    return new Response(JSON.stringify({ error: 'Term is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await axios.get(
      'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
      {
        params: { term },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com',
        },
      }
    );

    const definitions = response.data.list || [];
    return new Response(JSON.stringify({ definitions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching definitions:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch definitions.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
