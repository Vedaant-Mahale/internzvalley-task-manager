import express from 'express';
import cors from 'cors';
import { MongoClient } from "mongodb";


const app = express();
const port = 3000;
const uri = "mongodb://localhost:27017"; 
const client = new MongoClient(uri);
let db;

async function connectDB() 
{
    try 
    {
        await client.connect();
        db = client.db("test");
        console.log("Connected to MongoDB");
    } 
    catch (err) 
    {
        console.error("MongoDB connection error:", err);
    }
}
connectDB();
app.use(express.json()); 
app.use(cors({ origin: 'http://localhost:5173' }));
app.post('/init',async (req,res) =>
{
        db = client.db("auth"); 
        const result = await db.collection("Mycollection").insertOne({name:req.body.name,pass:req.body.pass});
        console.log(result);
}); 
app.post('/auth',async (req,res) =>
{
    db = client.db("auth"); 
    const result = await db.collection("Mycollection").find({name:req.body.name}).toArray();
    console.log(result);
    if(result.length == 0)
    {
        res.status(404).json({message: "Username doesnt exist"})
    }
    else
    {
        if(result[0].pass === req.body.pass)
        {
            res.status(200).json({message: "authorized"})
        }
        else
        {
            res.status(401).json({message: "incorrect password"})
        }
    }
});
app.delete("/delete", async (req, res) => 
{
    db = client.db("tasks");
    try 
    {
      const { task } = req.body;
      console.log(task);
        if (!task) 
        {
        return res.status(400).json({ message: "Task name is required" });
        }
  
      const result = await db.collection("task").deleteOne({ task });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
app.post('/create',async (req,res) =>
{
    db = client.db("tasks");
    const { name, task, date } = req.body;
    try 
    {
        const newEntry = { name, task, date };
        const result = await db.collection("task").insertOne(newEntry);
        res.status(201).json({ message: "Task added successfully", entry: newEntry, id: result.insertedId });
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})
app.get('/task',async (req,res) =>{
    db = client.db("tasks");
    const {name} = req.query;
    try 
    {
        console.log("Received name:", JSON.stringify(name)); // Shows any hidden spaces
        const allTasks = await db.collection("task").find({name:name}).toArray();
        console.log("All tasks in DB:", allTasks);            
        res.status(200).json({ allTasks });
    }
    catch (error)
    {
        console.log("Something Went Wrong",error);
        res.status(400).json({ error:error });
    }

})
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


