const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const db = require('./src/database')

require('dotenv').config()








app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Mongo DB Connections



const userRoutes = require("./src/routes/user")
const donationRoutes = require("./src/routes/donation")
const locationRoutes = require("./src/routes/location")
const needbloodRoutes = require("./src/routes/needblood")
app.use("/status", (req,res)=>{
    console.log("api called")
res.write("success")
res.end()
});
app.use("/v1/api/user", userRoutes);
app.use("/v1/api/donation", donationRoutes);
app.use("/v1/api/location", locationRoutes);
app.use("/v1/api/needblood", needbloodRoutes);



const PORT = process.env.PORT
app.listen(PORT, (data, err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server is Started at Port: "+PORT);

    }
})

// Connect to MongoDB
const DATABASE_URL = process.env.MONGO_DB_URL || 'mongodb://127.0.0.1:27017'
// const DATABASE_URL = 'mongodb://127.0.0.1:27017'
const DATABASE = process.env.DB || 'Aoneskills'
db(DATABASE_URL, DATABASE);