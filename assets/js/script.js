const video = document.querySelector('#video');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const photos = document.querySelector('#photos');
const takePhotoBtn = document.querySelector('#takePhoto');
const permissionsBtn = document.querySelector('#permissions');
const redRadio = document.querySelector('#red');
const splitRadio = document.querySelector('#split');
const ghostRadio = document.querySelector('#ghost');
const greenRadio = document.querySelector('#green');

console.dir(ghostRadio);

function start() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            permissionsBtn.style.display = 'none';
        })
        .catch(err => {
            alert(`Ocorreu um erro ao acessar sua webcam. Pfvr verifique as permissões de uso.\nError: ${err}`);
            console.error(err);
        });
}

function paintCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        ctx.globalAlpha = 1;
        if (ghostRadio.checked) {
            ctx.globalAlpha = 0.05;
            ctx.putImageData(pixels, 0, 0,);
        } else if (splitRadio.checked) {
            pixels = splitEffect(pixels);
            ctx.putImageData(pixels, 0, 0,);
        } else if (redRadio.checked) {
            pixels = redEffect(pixels);
            ctx.putImageData(pixels, 0, 0,);
        } else if (greenRadio.checked) {
            pixels = removeGreen(pixels);
            ctx.putImageData(pixels, 0, 0,);
        }

    }, 16);
}

function takePhoto() {
    const image = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = image;
    link.setAttribute('download', 'Screenshot Webcam');
    link.innerHTML = `<img src="${image}" alt="Screenshot Webcam" title="download image">`;
    photos.insertBefore(link, photos.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = pixels.data[i] + 200;
        pixels.data[i + 1] = pixels.data[i + 1] - 50;
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
    }
    return pixels;
}

function splitEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 100] = pixels.data[i];
        pixels.data[i + 200] = pixels.data[i + 1];
        pixels.data[i - 200] = pixels.data[i + 2];
    }
    return pixels;
}

function removeGreen(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        if (
            pixels.data[i + 0] < 180 &&
            pixels.data[i + 1] > 200 &&
            pixels.data[i + 2] < 180
        ) {
            pixels.data[i + 3] = 0;
        }
    }
    console.log(pixels)
    return pixels;
}

video.addEventListener('canplay', paintCanvas);
takePhotoBtn.addEventListener('click', takePhoto);
permissionsBtn.addEventListener('click', start);
start();
