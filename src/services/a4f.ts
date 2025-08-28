import FormData from 'form-data';

const A4F_API_KEY = process.env.A4F_API_KEY;
const A4F_API_BASE_URL = 'https://api.a4f.co/v1';

if (!A4F_API_KEY) {
    console.warn("A4F_API_KEY is not set. The A4F image generation service will not work.");
}

export async function generateImage(prompt: string): Promise<string> {
  if (!A4F_API_KEY) {
    throw new Error('A4F_API_KEY is not configured.');
  }

  const formData = new FormData();
  formData.append('model', 'provider-3/FLUX.1-dev');
  formData.append('prompt', prompt);
  formData.append('n', '1');
  formData.append('size', '1024x1024');

  const response = await fetch(`${A4F_API_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${A4F_API_KEY}`,
    },
    body: formData,
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
