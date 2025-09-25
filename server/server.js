import express from "express";
import cors from "cors"
import 'dotenv/config'
import connectDB from "./configs/db.js";
import { inngest, functions } from './inngest/index.js';
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import userRouter from "./routes/userroutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";
import messageRouter from "./routes/messageRoute.js";
import reelRouter from "./routes/mintoRoutes.js";

const app= express();
app.use(express.json());
await connectDB();
app.use(cors());
app.use(clerkMiddleware())

app.get('/', (req, res )=>
res.send("Hello , Welcome to the strym backend")
)
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/user',userRouter);
app.use("/api/chat",chatRoutes );
app.use("/api/post",postRouter );
app.use("/api/story",storyRouter );
app.use("/api/message", messageRouter);
app.use("/api/minto", reelRouter);




// Global error handling (inline)
app.use((err, req, res, next) => {
  console.error("❌ Backend errors:", err);
  res.status(500).json({ error: err.message || "Server Error" });
});


const  Port =process.env.port ||8000;
app.listen(Port,()=> console.log(`App is listening on port ${Port} `))