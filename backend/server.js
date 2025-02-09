const express = require('express');
//const cors = require('cors');

const app = express();
const port = 8000;

app.use(express.json());


app.post('/upload', (req, res)=>{
    console.log(req.body);
});

app.get('/', (req, res)=>{
    res.set('Content-Type', 'text/plain'); 
    res.send('You have reached the backend');
    console.log("Get Request");
});

app.listen(port, '0.0.0.0', ()=>{
    console.log(`Server running on port: ${port}`);
});