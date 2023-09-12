// Fetch zones from the JSON file and populate the left lists
fetch('zones.json')
    .then(response => response.json())
    .then(data => {
        const leftLists = document.getElementById('left-lists');
        
        data.forEach((gameObj, gameIndex) => {
            const gameTitle = document.createElement('div');
            gameTitle.textContent = gameObj.game;
            gameTitle.classList.add('game-title');
            leftLists.appendChild(gameTitle);

            const gameList = document.createElement('div');
            gameList.classList.add('list');
            gameList.classList.add('sub-item');
            
            gameObj.zones.forEach((zone, zoneIndex) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.textContent = zone;
                itemElement.id = 'item-' + gameIndex + '-' + zoneIndex;
                itemElement.draggable = true;
                itemElement.addEventListener('dragstart', handleDragStart);
                gameList.appendChild(itemElement);
            });
            
            leftLists.appendChild(gameList);
        });

        // Call this function once at the end of the fetch .then() block
        loadFromURL();
    });


// Handle drag start event
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

// Add drag over event to right list
const rightList = document.getElementById('right-list');
rightList.addEventListener('dragover', handleDragOver);
rightList.addEventListener('drop', handleDrop);

document.getElementById('share-url-button').addEventListener('click', shareListURL);

// Handle drag over event
function handleDragOver(event) {
    event.preventDefault();
}

// Handle drop event
function handleDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const itemElement = document.getElementById(id);
    rightList.appendChild(itemElement);
    updateRankingNumbers();
}

// Function to update ranking numbers
function updateRankingNumbers() {
    Array.from(rightList.children).forEach((item, index) => {
        item.textContent = `${index + 1}. ${item.textContent.replace(/^[\d]*\. /, '')}`;
    });
}

function shareListURL() {
    const rankedZones = Array.from(rightList.children).map(item => item.textContent.replace(/^[\d]*\. /, ''));
    const encodedList = encodeURIComponent(JSON.stringify(rankedZones));
    const newURL = `${window.location.origin}${window.location.pathname}?list=${encodedList}`;
    window.prompt("Copy this URL to share your list:", newURL);
}

// Function to load from URL
function loadFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedList = urlParams.get('list');
    if (encodedList) {
        const rankedZones = JSON.parse(decodeURIComponent(encodedList));
        rankedZones.forEach(zone => {
            const matchingItems = Array.from(document.querySelectorAll('.item'));
            const matchingItem = matchingItems.find(item => item.textContent === zone);
            if (matchingItem) {
                document.getElementById('right-list').appendChild(matchingItem);
            }
        });
        updateRankingNumbers();
    }
}

const bgMusic = document.getElementById('bg-music');
const muteButton = document.getElementById('mute-button');

muteButton.addEventListener('click', function() {
    if (bgMusic.muted) {
        bgMusic.muted = false;
        muteButton.textContent = "Mute";
    } else {
        bgMusic.muted = true;
        muteButton.textContent = "Unmute";
    }
});
