const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const PORT = 8000;
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const host = '192.168.0.100' ;



const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const upload = multer({dest: 'uploads/'});


app.get('/', (req, res)=>{
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send("You have reached the backend!");
    console.log(`${req.ip} tried to connect`);
});



app.post('/upload', upload.single('pdfFile'), (req, res)=>{
    const {queNos, queType, dur}  = req.body;
    const pdfFile = req.file;
    if (!pdfFile) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    const data = {
        total_question: queNos,
        question_type: queType,
        time_limit: dur
    }
    console.log(data);
    fs.writeFile('./user_params.json', JSON.stringify(data), (err)=>{
        if(err){console.error("Error Writing data to user_params.json");
            return res.status(500).json("Error Writing Json file");
        }
        res.json("data received");
    });
    fs.unlink('./output/json_file.json', (err)=>{
        if(err)console.log("Error Deleting Questions file.");
    })
});
let outputJson = 'json_file'+'.json';
app.get('/getQues', (req, res) => {
    const filePath = `./output/${outputJson}`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error reading file" });
        }
        try {
            res.json(JSON.parse(data));
        } catch (parseError) {
            res.status(500).json({ error: "Invalid JSON format" });
        }
    });
});


app.listen(PORT, host, () => {
    console.log(`Server running on http://${host}:${PORT}`);
});
