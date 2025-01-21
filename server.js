const express = require('express');
const bodyParser = require('body-parser');
const { search, ytmp3, ytmp4 } = require('@vreden/youtube_scraper');
const app = express();
const PORT = 3000;

// Middleware para parsear datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Esto es útil si estás trabajando con JSON

// Servir archivos estáticos (por ejemplo, HTML)
app.use(express.static('public'));

// Manejar la solicitud POST del formulario
app.post('/download', async (req, res) => {
    const { link, type, quality } = req.body;
    try {
        let result;
        if (type === 'audio') {
            result = await ytmp3(link, quality);
        } else if (type === 'video') {
            result = await ytmp4(link, quality);
        } else {
            return res.status(400).send('Invalid type option');
        }

        if (result.status) {
            console.log('Download Link:', result.download);
            console.log('Metadata:', result.metadata);
            const { url } = result.download;
            const { thumbnail } = result.metadata;
            res.json({ downloadUrl: url, thumbnail: thumbnail }); 
        } else {
            console.error('Error:', result.result);
            res.status(500).send('Error processing request');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



// const url = 'https://www.youtube.com/watch?v=4LfJnj66HVQ'
// const quality = "128"


// ytmp3(url, quality)
//     .then(result => {
//         if (result.status) {
//             console.log('Download Link:', result.download);
//             console.log('Metadata:', result.metadata);
           

//         } else {
//             console.error('Error:', result.result);
//         }
//     });
//     app.get('/api/download-url', (req, res) => {
//         // Enviar solo la URL en la respuesta
//         res.json({ url: downloadLink.url });
//       });
