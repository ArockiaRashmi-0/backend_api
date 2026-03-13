const { MongoClient } = require('mongodb');

// Get your URI from Vercel Environment Variables
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  // 1. ADD CORS HEADERS (Crucial for GitHub Pages to talk to Vercel)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle the 'OPTIONS' pre-flight request (Required by browsers)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. ONLY ALLOW POST
  if (req.method === 'POST') {
    try {
      await client.connect();
      const db = client.db('BCAProject'); 
      const collection = db.collection('formSubmissions');

      // result of the insertion
      const result = await collection.insertOne(req.body);

      return res.status(200).json({ 
        success: true,
        message: "Success! Data saved to MongoDB.", 
        id: result.insertedId 
      });

    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    } finally {
      // We keep it open for serverless performance, 
      // but closing is okay for simple projects
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
