import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const query = body.query;

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const response = await fetch('https://api.groq.com/v1/queries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
