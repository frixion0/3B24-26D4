import FormData from 'form-data';

const A4F_API_KEY = process.env.A4F_API_KEY;
const A4F_BASE_URL = "https://api.a4f.co/v1";

if (!A4F_API_KEY) {
  console.warn("A4F_API_KEY is not set. The image generation will not work.");
}

export async function generateImage(prompt: string): Promise<string> {
  if (!A4F_API_KEY) {
    throw new Error("A4F_API_KEY is not configured.");
  }

  const response = await fetch(`${A4F_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${A4F_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "provider-3/FLUX.1-dev",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Failed to generate image with A4F:', errorBody);
    throw new Error(`Failed to generate image. Status: ${response.status}`);
  }

  const result = await response.json();
  const b64Json = result.data[0].b64_json;
  
  if (!b64Json) {
      throw new Error("No image data returned from API.");
  }

  return `data:image/png;base64,${b64Json}`;
}
