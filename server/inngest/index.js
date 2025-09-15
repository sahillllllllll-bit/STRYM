import { Inngest } from "inngest";
import mongoose from "mongoose";
import User from "../models/User.js";
import sendMail from "../configs/nodemailer.js";
import Connection from "../models/Connection.js";
import Story from "../models/Story.js";
import Message from "../models/Message.js";

// --------------------
// MongoDB Connection
// --------------------
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI not set in environment variables");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
  console.log("✅ MongoDB connected");
}

// --------------------
// Create Inngest client
// --------------------
export const inngest = new Inngest({ id: "strym" });

// --------------------
// Clerk user.created
// --------------------
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    let username = email_addresses[0].email_address.split("@")[0];

    // check availability of username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username,
    };

    await User.create(userData);

    return { message: "User created", userId: id };
  }
);

// --------------------
// Clerk user.updated
// --------------------
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await connectDB();

    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    };

    await User.findByIdAndUpdate(id, updatedUserData, { new: true });

    return { message: "User updated", userId: id };
  }
);

// --------------------
// Clerk user.deleted
// --------------------
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.findByIdAndDelete(id);

    return { message: "User deleted", userId: id };
  }
);

// --------------------
// Connection Reminder
// --------------------
const sendnewconnectionreminder = inngest.createFunction(
  { id: "send-new-connection-reminder" },
  { event: "app/connection-request" },
  async ({ event, step }) => {
    await connectDB();

    const { connectionId } = event.data;

    await step.run("send-connection-request-mail", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );

      if (!connection) throw new Error("Connection not found");

      const subject = `👋🏻 New Connection Request`;
      const body = `<div style="font-family: Arial, Helvetica, sans-serif; padding: 20px;">
        <h2>Hi ${connection.to_user_id.full_name},</h2>
        <p>You have a new connection request from ${connection.from_user_id.full_name}-@${connection.from_user_id.username}</p>
        <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981;">here</a> to accept or reject the request</p>
        <br/>
        <p>Thanks <br/>Strym - Stay Connected</p>
      </div>`;

      await sendMail({ to: connection.to_user_id.email, subject, body });
    });

    const in24hrs = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await step.sleepUntil("wait-for-24-hrs", in24hrs);

    await step.run("send-connection-request-reminder", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );

      if (!connection) return { message: "Connection not found" };
      if (connection.status === "accepted") {
        return { message: "Already accepted" };
      }

      const subject = `👋🏻 New Connection Request`;
      const body = `<div style="font-family: Arial, Helvetica, sans-serif; padding: 20px;">
        <h2>Hi ${connection.to_user_id.full_name},</h2>
        <p>You have a new connection request from ${connection.from_user_id.full_name}-@${connection.from_user_id.username}</p>
        <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981;">here</a> to accept or reject the request</p>
        <br/>
        <p>Thanks <br/>Strym - Stay Connected</p>
      </div>`;

      await sendMail({ to: connection.to_user_id.email, subject, body });

      return { message: "Reminder sent" };
    });
  }
);

// --------------------
// Delete Story after 20 hrs
// --------------------
const deleteStory = inngest.createFunction(
  { id: "story-delete" },
  { event: "app/story.delete" },
  async ({ event, step }) => {
    await connectDB();

    const { storyId } = event.data;
    const in20hrs = new Date(Date.now() + 20 * 60 * 60 * 1000);

    await step.sleepUntil("wait-for-20-hours", in20hrs);

    await step.run("delete-story", async () => {
      await Story.findByIdAndDelete(storyId);
      return { message: "Story deleted" };
    });
  }
);

// --------------------
// Unseen Messages Notification (9am daily)
// --------------------
const sendNotificationOfUnseenMessages = inngest.createFunction(
  { id: "send-unseen-messages-notification" },
  { cron: "TZ=America/New_York 0 9 * * *" },
  async ({ step }) => {
    await connectDB();

    const messages = await Message.find({ seen: false }).populate("to_user_id");
    const unseenCount = {};

    messages.forEach((message) => {
      unseenCount[message.to_user_id._id] =
        (unseenCount[message.to_user_id._id] || 0) + 1;
    });

    for (const userId in unseenCount) {
      const user = await User.findById(userId);
      if (!user) continue;

      const subject = `🩷 You have ${unseenCount[userId]} unseen messages`;
      const body = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${user.full_name},</h2>
          <p>You have ${unseenCount[userId]} unseen messages</p>
          <p>
            Click <a href="${process.env.FRONTEND_URL}/messages" style="color: #10b981;">here</a> to view them
          </p>
          <br/>
          <p>Thanks,<br/>PingUp - Stay Connected</p>
        </div>
      `;

      await sendMail({ to: user.email, subject, body });
    }

    return { message: "Unseen message notifications sent" };
  }
);

// --------------------
// Export functions
// --------------------
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  sendnewconnectionreminder,
  deleteStory,
  sendNotificationOfUnseenMessages,
];
