const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.0f5vnoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {




    const userCollection = client.db('userDB').collection('user');
    const dataCollection = client.db('dataDB').collection('data');
    //uplaoadin user data
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result)
    })

    ///add iteam data
    app.post('/additem', async (req, res) => {
      // console.log(req.body);
      const item = req.body;
      const result = await dataCollection.insertOne(item)
      res.send(result)
    })
    //my craft list

    app.get('/myCraft/:email', async (req, res) => {
      const result = await dataCollection.find({ email: req.params.email }).toArray();
      res.send(result)

    })

    //all craft loaded
    app.get('/allCraft', async (req, res) => {
      const allCraft = await dataCollection.find().toArray();
      res.send(allCraft)
    })
    //  update data
    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateItem = req.body;
      console.log(updateItem);
      const item = {
        $set: {
          name: updateItem.name,
          creator: updateItem.creator,
          description: updateItem.description,
          publishDate: updateItem.publishDate,
          imageUrl: updateItem.imageUrl,
          category: updateItem.category,
          price: updateItem.price,
          rating: updateItem.rating,
          customization: updateItem.customization,
          stockStatus: updateItem.stockStatus,

        }
      };
      const result = await dataCollection.updateOne(filter, item, option);
      res.send(result)
    })
    //Subcategory filter
    app.get('/category/:subcategory', async(req, res)=>{
      const sub = req.params.subcategory;
      // const sub = "Knitting";
      const regex = new RegExp(sub, "i")
      const result = await dataCollection.find({category:regex}).toArray();
      console.log(result);
      res.send(result)
      console.log(sub,);
    })
    //delete craft from my card
    app.delete('/myCraft/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      // console.log(quary);
      const result = await dataCollection.deleteOne(quary);
      res.send(result)
    })


    ///Craft details find with id

    app.get('/allCraft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await dataCollection.findOne(query);
      res.send(result);
    })
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
