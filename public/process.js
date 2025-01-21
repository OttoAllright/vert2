
const form = document.getElementById('url-form'); // Selecciona el formulario
const typeSelect = document.getElementById('type-select');
const qualitySelect = document.getElementById('quality-select');
const downloadBtn = document.getElementById('download-btn');
const loadingBar = document.getElementById('loading-bar');
const loadingProgress = document.getElementById('loading-progress');
const thumbnailImg = document.getElementById('thumbnail-img');

const audioQualities = [
    { value: '128', text: 'Audio (128Kbps)' },
    { value: '256', text: 'Audio (256Kbps)' },
    { value: '320', text: 'Audio (320Kbps)' }
];

const videoQualities = [
    { value: '360', text: 'Video (360p)' },
    { value: '480', text: 'Video (480p)' },
    { value: '720', text: 'Video (720p)' },
    { value: '1080', text: 'Video (1080p)' }
];

typeSelect.addEventListener('change', function() {
    // Limpiar opciones anteriores
    qualitySelect.innerHTML = '';
    let options;

    // Añadir opciones basadas en la selección
    if (this.value === 'audio') {
        options = audioQualities;
    } else {
        options = videoQualities;
    }

    // Agregar las nuevas opciones al select de calidad
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        qualitySelect.appendChild(opt);
    });
});

// Disparar el evento change al cargar la página para establecer las opciones iniciales
typeSelect.dispatchEvent(new Event('change'));

form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita el envío del formulario
    
    const formData = new FormData(form); // Crea un objeto FormData a partir del formulario
    loadingProgress.style.width = '0%';
    loadingProgress.textContent = 'Cargando';
    loadingBar.style.display = 'block';
    thumbnailImg.style.display = 'none';
    downloadBtn.style.display = 'none';

    // Simular barra de carga
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        loadingProgress.style.width = progress + '%';
        loadingProgress.textContent = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            loadingProgress.textContent = '100% ¡Listo!';
        }
    }, 200);

    const response = await fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString() // Convierte FormData a URL-encoded string
    });

    if (response.ok) {
        const data = await response.json();
        downloadBtn.href = data.downloadUrl;
        thumbnailImg.src = data.thumbnail;
        thumbnailImg.style.display = 'block';
        downloadBtn.style.display = 'block';
    } else {
        alert('Error processing request');
    }
});
