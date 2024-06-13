const { MongoClient } = require('mongodb');

async function setupChangeStream() {
  const uri = 'YOUR_MONGODB_URI'; // replace with your MongoDB connection string
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('langchain_db');
    const collection = db.collection('conversations');
    const changeStream = collection.watch();

    changeStream.on('change', (next) => {
      console.log('Change detected:', next);
      // Handle the change event and send it to the frontend via WebSocket
    });
  } catch (err) {
    console.error(err);
  }
}

setupChangeStream();
