const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

require('dotenv').config()
const db_link=process.env.MONGO_DB_URL;






app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Mongo DB Connections
mongoose.connect(`${db_link}/donerhub`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(res=>{
    console.log('MongoDB Connection Succeeded')
}).catch(err=>{
    console.log('Error in DB connection: ' + err)
});


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
