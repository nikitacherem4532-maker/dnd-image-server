import Replicate from 'replicate';

// Ключ берётся из защищённых переменных окружения Vercel
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  // Разрешаем запросы только с вашего сайта (замените на ваш домен GitHub Pages)
  res.setHeader('Access-Control-Allow-Origin', 'https://nikitacherem4532-maker.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const output = await replicate.run(
        "black-forest-labs/flux-schnell",
        {
          input: {
            prompt: prompt + ", fantasy character, dnd, digital art, best quality",
            width: 768,
            height: 1024
          }
        }
      );

      // output[0] содержит URL сгенерированного изображения
      res.status(200).json({ imageUrl: output[0] });
    } catch (error) {
      console.error('Generation error:', error);
      res.status(500).json({ error: 'Image generation failed' });
    }
  } else {
    // Если запрос не POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}