const getResolution = async (pixivId) => {
    try {
        const response = await fetch(`https://www.pixiv.net/ajax/illust/${pixivId}/pages`);
        const data = await response.json();

        if (data && data.body) {
            const resolutions = [];
            for (let item of data.body) {
                const imgUrl = item.urls.original;
                const image = new Image();
                image.src = imgUrl;
                image.onload = () => {
                    resolutions.push({ width: image.width, height: image.height });
                    if (resolutions.length === data.body.length) {
                        console.log('All resolutions fetched:', resolutions);
                        localStorage.setItem(`pixiv_${pixivId}_resolution`, JSON.stringify(resolutions));
                        displayResolution(resolutions);
                    }
                };
            }
        }
    } catch (error) {
        console.error("Error fetching resolution:", error);
    }
}

const displayResolution = (resolutions) => {
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

        // Display all resolutions vertically
        const resolutionTexts = resolutions.map(res => `${res.width} x ${res.height}`);
        label.textContent = resolutionTexts.join('\n');

        targetDiv.appendChild(label);
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