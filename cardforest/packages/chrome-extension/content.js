const getResolution = async (pixivId) => {
    try {
        const response = await fetch(`https://www.pixiv.net/ajax/illust/${pixivId}`);
        const data = await response.json();
        if (data && data.body && data.body.urls && data.body.urls.original) {
            const imgUrl = data.body.urls.original;
            const image = new Image();
            image.src = imgUrl;
            image.onload = () => {
                const resolution = { width: image.width, height: image.height };
                console.log(`Resolution: ${resolution.width} x ${resolution.height}`);
                localStorage.setItem(`pixiv_${pixivId}_resolution`, JSON.stringify(resolution));
                displayResolution(resolution);
            };
        }
    } catch (error) {
        console.error("Error fetching resolution:", error);
    }
}

const displayResolution = (resolution) => {
    const targetDiv = document.querySelector('body');
    if (targetDiv) {
        const label = targetDiv.querySelector('#pixivResolutionLabel');
        label.textContent = `${resolution.width} x ${resolution.height}`;
    }
}

const displayLoading = () => {
    const targetDiv = document.querySelector('body');
    if (targetDiv) {
        const existingLabel = targetDiv.querySelector('#pixivResolutionLabel');
        if (existingLabel) {
            existingLabel.remove();
        }

        const label = document.createElement('div');
        label.id = 'pixivResolutionLabel';
        label.style.position = 'fixed';
        label.style.left = '10px';
        label.style.top = '10px';
        label.style.background = 'rgba(255, 255, 255, 0.5)';
        label.textContent = 'Loading...';
        targetDiv.appendChild(label);
    }
}

const processPage = () => {
    alert('111')
    const pixivId = window.location.pathname.split('/')[2];
    if (pixivId) {
        displayLoading();

        const storedResolution = JSON.parse(localStorage.getItem(`pixiv_${pixivId}_resolution`));
        console.log('storedResolution', storedResolution);
        if (storedResolution) {
            console.log('displaying stored resolution');
            displayResolution(storedResolution);
        } else {
            console.log('fetching resolution');
            getResolution(pixivId);
        }
    }
}

// Initial processing
processPage();

// Listen for URL changes
let currentURL = '';

const checkURLChange = () => {
    if (currentURL !== window.location.href) {
        currentURL = window.location.href;
        processPage();
    }
}

// 设置每秒检查一次URL的定时器
setInterval(checkURLChange, 1000);