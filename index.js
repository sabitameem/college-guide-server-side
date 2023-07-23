const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sgocvky.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const collegeDataCollection = client
      .db("collegeGuideDb")
      .collection("collegedata");
    const submittedCollegeCollection = client
      .db("collegeGuideDb")
      .collection("submittedData");

    app.get("/collegedata", async (req, res) => {
      // res.send('hello')
      const result = await collegeDataCollection.find().toArray();

      res.send(result);
    });

    

    app.get('/collegedata/:id', async(req,res)=>{
      const id =req.params.id;
      const query = { _id: new ObjectId(id) };
      const detailsInfo = await collegeDataCollection.findOne(query)
      res.send(detailsInfo);

    })

    app.post("/submit", async (req, res) => {
      try {
        const submittedData = req.body; // Assuming the request body contains the candidate information
    
        // Store the submitted data in the "submittedCollegeCollection" collection
        const result = await submittedCollegeCollection.insertOne(submittedData);
    
        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Data submitted successfully" });
        } else {
          res.status(500).json({ message: "Failed to submit data" });
        }
      } catch (error) {
        console.error("Error submitting data:", error);
        res.status(500).json({ message: "Failed to submit data" });
      }
    });

    app.get('/submit', async(req,res)=>{
      const email = req.query.email;
      // res.send(email)
      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result =await submittedCollegeCollection.find(query).toArray();
      res.send(result)
    })
    







    // In your server code, create a new route to handle fetching college details

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Language sikho sobai");
});

app.listen(port, () => {
  console.log(`language sikhte hole aso sikhi : ${port}eeeeeeee`);
});
