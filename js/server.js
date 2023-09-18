import * as dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import fs from 'fs';

dotenv.config()

const API_TOKEN = process.env.HUGGINGFACE
const app = express();
app.use(cors());
app.use(express.json());

app.post('/dream', async (req, res) => {
    try{
    const prompt = req.body.prompt;

    const inputData = {
        inputs: prompt,
        options: {
            wait_for_model:true,
        },
    }

    const aiResponse = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
        {
            headers: { 
                Authorization: `Bearer ${API_TOKEN}`,
         },
			method: "POST",
			body: JSON.stringify(inputData),
    });

    const mimeType = 'image/png'
    const result = await aiResponse.arrayBuffer();
    const base64data = Buffer.from(result).toString('base64')

    const img = `data:${mimeType};base64,` + base64data

    res.send({img});

    // const base64Image = base64data.replace(/^data:image\/png;base64,/, "");

    // // write the base64 data to an image file
    // fs.writeFile("output.png", base64Image, 'base64', function(err) {
    //     if(err) {
    //         console.log(err);
    //         res.status(500).send(err || 'Something went wrong');
    //     } else {
    //         res.send({message: "Image saved successfully."});
    //     }
    // });
} catch (error) {
    console.log(error)
    res.status(500).send(error?.response.data.error.message || 'Something went wrong')
}
});

app.listen(8080, () => console.log('make art on http://localhost:8080/dream'));