const { MongoClient } = require('mongodb');

// We use an Environment Variable so your password isn't in the code
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  // Only allow POST requests (sending data)
  if (req.method === 'POST') {
    try {
      await client.connect();
      
      // Connect to your specific database and collection
      const db = client.db('BCAProject'); 
      const collection = db.collection('formSubmissions');

      // Insert the data coming from your GitHub Pages form
      const result = await collection.insertOne(req.body);

      // Tell the browser "Success!"
      return res.status(200).json({ 
        message: "Success! Data saved to MongoDB.", 
        id: result.insertedId 
      });

    } catch (error) {
      return res.status(500).json({ error: "Database error: " + error.message });
    } finally {
      await client.close();
    }
  } else {
    // If someone tries to just "visit" the URL, tell them No.
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
