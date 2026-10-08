import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  
  // 1. DYNAMIC DATA RETRIEVAL (GET): Supplies structured JSON data to the homepage index
  if (req.method === 'GET') {
    try {
      const storedContent = await redis.get('homepage_content');
      
      // Strict Fallback Shield: If the database is missing or empty, serve this valid structural default
      if (!storedContent) {
        return res.status(200).json({
          hero_title: "Arshhi – Door to door beauty care",
          profile_image: "" // Kept empty to safely fall back to your local repository image path
        });
      }

      // Safe JSON evaluation whether data was saved as a string object or raw mapping parameters
      const parsedData = typeof storedContent === 'string' ? JSON.parse(storedContent) : storedContent;
      return res.status(200).json(parsedData);

    } catch (err) {
      // Emergency default response structure so the homepage never shatters if Upstash drops offline
      return res.status(200).json({
        hero_title: "Arshhi – Door to door beauty care",
        profile_image: ""
      });
    }
  }

  // 2. ADMINISTRATIVE UPDATE (POST): Validates credentials and overwrites data entries safely
  if (req.method === 'POST') {
    try {
      const { content } = req.body;
      const authHeader = req.headers.authorization;

      // Restrict access using your custom Vercel Project Environment Variable
      if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
        return res.status(401).json({ error: "Unauthorized access blocked." });
      }

      // Save the website layout JSON object into Upstash Redis under the primary key target
      await redis.set('homepage_content', JSON.stringify(content));
      return res.status(200).json({ success: true, message: "Database updated successfully!" });

    } catch (err) {
      return res.status(500).json({ error: "Failed to write updates down to Redis" });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
