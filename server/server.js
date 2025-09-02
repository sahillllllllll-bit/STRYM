import express from "express";
import cors from "cors"
import 'dotenv/config'
import connectDB from "./configs/db.js";
import { inngest, functions } from './inngest/index.js';
import { serve } from "inngest/express";

const app= express();
app.use(express.json());
await connectDB();
app.use(cors());

app.get('/', (req, res )=>
res.send("Hello , Welcome to the strym backend")
)
app.use("/api/inngest", serve({ client: inngest, functions }));


const  Port =process.env.port ||8080;
app.listen(Port,()=> console.log(`App is listening on port ${Port} `))