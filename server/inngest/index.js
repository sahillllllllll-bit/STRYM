import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "strym" });

// inngest function to save user data to a database.

const syncUserCreation= inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async (event) => {
        const {id,first_name, last_name,email_addresses,image_url}= event.data
        let username = email_addresses[0].email_addresses.split('@')[0]

        // check availaibity of username
        const user = await User.findOne({username})
        if(user){
         username=username +Math.floor(Math.random()*10000);
        }

        const userData ={
            _id :id,
             email:email_addresses[0].email_addresses,
             full_name : first_name+ " " +last_name,
             profile_picture: image_url,
             username
        }
        await User.create(userData);

    }
)

// inngest function to update user data in database,

const syncUserUpdation= inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},
    async (event) => {
        const {id,first_name, last_name,email_addresses,image_url}= event.data
       
  const updatedUserData ={
      email:email_addresses[0].email_addresses,
             full_name : first_name+ " " +last_name,
             profile_picture: image_url
  }

         await User.findByIdAndUpdate(userData);

    }
)

// inngest function to delete user data in database,

const syncUserDeletion= inngest.createFunction(
    {id:'delete-user-from-clerk'},
    {event:'clerk/user.deleted'},
    async (event) => {
        const {id}= event.data
       
 

         await User.findByIdAndDelete(userData);

    }
)





// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation];