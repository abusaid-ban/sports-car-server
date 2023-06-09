const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vmq30zn.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        

        const productCollection = client.db('sportsToys').collection('products')

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result);
        })
        // new toys add

        app.get('/myToys', async (req, res) => {

            const getEmail = req.query.email;
            console.log(getEmail);
            const query = { email: getEmail }
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);


        })


        app.post('/products', async (req, res) => {
            const newProducts = req.body;
            console.log(newProducts);
            const result = await productCollection.insertOne(newProducts);
            res.send(result);

        })
        app.put('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedToys = req.body;
            const Toys = {
                $set:{
                    price: updatedToys.price,
                    quantity: updatedToys.quantity,
                    details: updatedToys.details,
                }
            }
            const result = await productCollection.updateOne(filter,Toys,options)
            res.send(result);

        })

        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            res.send(result);

        })

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
    res.send('Sports toys is running');
})

app.listen(port, () => {
    console.log(`sports toys server is running on port:${port}`)
})