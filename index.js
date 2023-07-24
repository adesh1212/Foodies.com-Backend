const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const connetToDB = require('./db');
const router = require('./Routes/CreateUser');
const cors = require('cors');

// To allow frontend to send the data on the backend server --> IMP  else error will occur
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header(
//          "Access-Control-Allow-Headers",
//          "Origin, X-Requested-With,Content-Type,Accept"
//     )
//     next();
//   }) 


// another way to send data to the server
app.use(cors());

app.use(express.json());
app.use('/api',router);
app.use('/api',require('./Routes/DisplayData'));
app.use('/api',require('./Routes/OrderData'));

connetToDB().then(()=>{
    console.log('Conneted to the DB');
    app.listen(port,()=>{
        console.log(`Server is listening on port ${port}`);
    })
}).catch((err)=>{
    console.log("Error occured",err);
})


