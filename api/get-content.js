import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  
  // 1. FRONTEND CONNECTION (GET): Fetches live updates for your homepage index
  if (req.method === 'GET') {
    try {
      const storedContent = await redis.get('homepage_content');
      
      // Safety net: If your Redis data got corrupted by the photo upload, use this default template
      if (!storedContent) {
        return res.status(200).json({
          hero_title: "Arshhi – Door to door beauty care",
          profile_image: "" // Kept empty to gracefully default to local repo assets if blank
        });
      }

      // Parse data accurately whether it was saved as a stringified text or a clean object
      const parsedData = typeof storedContent === 'string' ? JSON.parse(storedContent) : storedContent;
      return res.status(200).json(parsedData);

    } catch (err) {
      // Emergency fallback structure so the homepage never shatters if the database crashes
      return res.status(200).json({
        hero_title: "Arshhi – Door to door beauty care",
        profile_image: ""
      });
    }
  }

  // 2. ADMIN CONNECTION (POST): Receives and saves modifications from your dashboard
  if (req.method === 'POST') {
    try {
      const { content } = req.body;
      const authHeader = req.headers.authorization;

      // Verify your secret environment variable token before writing to Upstash
      if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
        return res.status(401).json({ error: "Unauthorized access blocked." });
      }

      // Overwrite the 'homepage_content' key with the new, clean dataset structure
      await redis.set('homepage_content', JSON.stringify(content));
      return res.status(200).json({ success: true, message: "Database updated successfully!" });

    } catch (err) {
      return res.status(500).json({ error: "Failed to write updates down to Redis" });
    }
  }

  // Fallback for any unsupported traffic requests
  return res.status(405).json({ error: 'Method not allowed' });
}
