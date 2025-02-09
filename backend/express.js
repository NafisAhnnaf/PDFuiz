const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const host = "192.168.0.100";
const port = 8000;

const app = express();
app.use(cors());
const upload = multer({ dest: '../uploads/' });  // Update path to be more consistent

app.get('/', (req, res) => {
    res.set({
        "Content-Type": "text/plain"
    });
    res.status(200).send("You have reached the backend");
});

// POST endpoint to handle file and form data
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    const { queNos, queType, dur } = req.body;
    const file = req.file;

    // Check if file was uploaded
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Check for missing form fields
    if (!queNos || !queType || !dur) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare the data
    const data = {
        total_question: queNos,
        question_type: queType,
        time_limit: dur
    };

    console.log('Received Data:', data);

    // Save data (e.g., insert into database or JSON file)
    fs.writeFile('../uploads/user_params.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing data to user_params.json', err);
            return res.status(500).json({ error: 'Error writing JSON file' });
        }
        res.json({ message: 'Data received successfully' });
    });
});

app.get('/getQues', (req, res) => {
    const outputJson = 'json_file.json'; // Define outputJson file name
    const filePath = `../output/${outputJson}`;

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

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
