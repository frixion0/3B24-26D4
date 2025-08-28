'use server';

const A4F_API_KEY = "ddc-a4f-25c62da6794b4fdf9720708012108518";
const A4F_API_BASE_URL = 'https://api.a4f.co/v1';

if (!A4F_API_KEY) {
  console.warn(
    'A4F_API_KEY is not set. The A4F image generation service will not work.'
  );
}

export async function generateImage(prompt: string, model: string = 'provider-3/FLUX.1-dev'): Promise<string> {
  if (!A4F_API_KEY) {
    throw new Error('A4F_API_KEY is not configured.');
  }

  const response = await fetch(`${A4F_API_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${A4F_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Failed to generate image with A4F:', errorBody);
    throw new Error(`Failed to generate image. Status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.data || !result.data[0] || !result.data[0].url) {
    console.error('Unexpected response format from A4F:', result);
    throw new Error('Failed to get image URL from A4F response.');
  }

  return result.data[0].url;
}
