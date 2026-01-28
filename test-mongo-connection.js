import { MongoClient } from 'mongodb';

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tijarah';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // List all databases
    const adminDb = client.db('admin');
    const result = await adminDb.admin().listDatabases();
    console.log('Available databases:', result.databases.map(db => db.name));
    
    // Check if tijarah database exists
    const dbs = result.databases.map(db => db.name);
    if (dbs.includes('tijarah')) {
      console.log('✅ Database "tijarah" exists');
      
      // Check collections in tijarah database
      const db = client.db('tijarah');
      const collections = await db.listCollections().toArray();
      console.log('Collections in "tijarah" database:', collections.map(c => c.name));
      
      // Check if users collection exists
      if (collections.some(c => c.name === 'users')) {
        const users = await db.collection('users').find().toArray();
        console.log(`Found ${users.length} users in the database`);
      }
    } else {
      console.log('❌ Database "tijarah" does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('Error stack:', error.stack);
  } finally {
    await client.close();
    process.exit(0);
  }
}

testConnection().catch(console.error);
