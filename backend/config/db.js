import mongoose from "mongoose";

export const connectDB = async ()=>{
await mongoose.connect(process.env.MONGODB_URI).then(() => console.log("DB Connected")).catch((err) => {console.error("DB Connection failed:", err.message); process.exit(1);});
    }

    //in config folder we are creating a file db.js to handle database connection and export the connectDB function to be used in server.js file to establish connection with the database when the server starts.

    //nodemon is used to maintain state on server as it do not need refreshing 
    //bcrypt is used to handle password hashing and verfications securely in applications 
    //jwt deependency is used to implement stateless authentication and authorization 
    // stripe is used as a dependency to integrate primarily payment for web applications and mobile application 
    // validator is used as a dependency to enable validation logic to rely on external dta or services 