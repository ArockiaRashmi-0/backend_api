const { MongoClient } = require('mongodb');

// URI comes from your Vercel Environment Variables
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  // 1. SET HEADERS (Allows GitHub Pages to talk to Vercel)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle the 'OPTIONS' pre-flight request (Browsers do this automatically)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. ONLY PROCESS POST REQUESTS
  if (req.method === 'POST') {
    try {
      await client.connect();
      const db = client.db('BCAProject'); 
      const collection = db.collection('formSubmissions');

      // The data sent from your website is in req.body
      const result = await collection.insertOne(req.body);

      // Return a 200 Success
      return res.status(200).json({ 
        success: true, 
        message: "Data successfully saved to MongoDB!", 
        id: result.insertedId 
      });

    } catch (error) {
      console.error("MongoDB Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    } finally {
      await client.close();
    }
  } else {
    // This is what triggered your orange 405 log!
    res.status(405).json({ message: "Method Not Allowed. Use POST instead." });
  }
};
