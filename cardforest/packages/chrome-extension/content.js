const getResolution = async (pixivId) => {
    try {
        const response = await fetch(`https://www.pixiv.net/ajax/illust/${pixivId}/pages`);
        const data = await response.json();
        const resolutions = [];

        if (data && data.body) {
            for (let item of data.body) {
                resolutions.push({ width: item.width, height: item.height });
            }
        }

        return resolutions;

    } catch (error) {
        console.error("Error fetching resolution:", error);
        return [];
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


const processSinglePage = async (pixivId) => {
    displayLoading();
    const storedResolution = JSON.parse(localStorage.getItem(`pixiv_${pixivId}_resolution`));
    if (storedResolution) {
        displayResolution(storedResolution);
    } else {
        const fetchedResolutions = await getResolution(pixivId);
        localStorage.setItem(`pixiv_${pixivId}_resolution`, JSON.stringify(fetchedResolutions));
        displayResolution(fetchedResolutions);
    }
}

const processBookmarkPage = async () => {
    const artworkLinks = document.querySelectorAll('a[data-gtm-value]');
    const allResolutions = [];

    displayLoading();

    console.log('artworkLinks', artworkLinks)

    for (const link of artworkLinks) {
        const pixivId = link.getAttribute('data-gtm-value');
        const storedResolution = JSON.parse(localStorage.getItem(`pixiv_${pixivId}_resolution`));
        if (storedResolution) {
            allResolutions.push(storedResolution);
            console.log('Read resolution for', pixivId, allResolutions)
        } else {
            const fetchedResolutions = await getResolution(pixivId);
            localStorage.setItem(`pixiv_${pixivId}_resolution`, JSON.stringify(fetchedResolutions));
            allResolutions.push(fetchedResolutions);
            console.log('Fetched resolution for', pixivId, allResolutions)
        }
    }

    displayResolution(allResolutions.flat());
}

const processPage = () => {
    if (window.location.pathname.startsWith('/artworks/')) {
        const pixivId = window.location.pathname.split('/')[2];
        processSinglePage(pixivId);
    } else if (window.location.pathname.startsWith('/users/') && window.location.pathname.endsWith('/bookmarks/artworks')) {
        setInterval(processBookmarkPage, 10000);
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