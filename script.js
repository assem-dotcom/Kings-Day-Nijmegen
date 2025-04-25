// Navigation
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetSection = button.dataset.section;
        
        // Update active states
        navButtons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(targetSection).classList.add('active');
    });
});

// Train Section - Predictions
const predictionInput = document.getElementById('prediction-input');
const submitPrediction = document.getElementById('submit-prediction');
const predictionsList = document.getElementById('predictions-list');
const predictions = [];

submitPrediction.addEventListener('click', () => {
    const prediction = predictionInput.value.trim();
    if (prediction) {
        predictions.push(prediction);
        updatePredictionsList();
        predictionInput.value = '';
        
        // Add animation to the new prediction
        const newPrediction = predictionsList.lastElementChild;
        if (newPrediction) {
            newPrediction.style.animation = 'fadeIn 0.5s ease-in';
        }
    }
});

function updatePredictionsList() {
    predictionsList.innerHTML = predictions.map((pred, index) => `
        <div class="prediction-item">
            <span>${index + 1}. ${pred}</span>
            <button class="delete-prediction" data-index="${index}">×</button>
        </div>
    `).join('');
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-prediction').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.dataset.index);
            predictions.splice(index, 1);
            updatePredictionsList();
        });
    });
}

// Train Section - Dutch or Drunk Game
const playAudioBtn = document.getElementById('play-audio');
const guessButtons = document.querySelectorAll('.guess-btn');

const dutchWords = [
    { word: 'gezellig', audio: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Nl-gezellig.ogg' },
    { word: 'lekker', audio: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Nl-lekker.ogg' },
    { word: 'gezondheid', audio: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Nl-gezondheid.ogg' },
    { word: 'proost', audio: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Nl-proost.ogg' },
    { word: 'dankjewel', audio: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Nl-dankjewel.ogg' }
];

const drunkSounds = [
    { word: 'blub', audio: 'https://freesound.org/data/previews/131/131142_2337290-lq.mp3' },
    { word: 'woosh', audio: 'https://freesound.org/data/previews/131/131142_2337290-lq.mp3' },
    { word: 'splash', audio: 'https://freesound.org/data/previews/131/131142_2337290-lq.mp3' },
    { word: 'gurgle', audio: 'https://freesound.org/data/previews/131/131142_2337290-lq.mp3' },
    { word: 'plop', audio: 'https://freesound.org/data/previews/131/131142_2337290-lq.mp3' }
];

let currentAudio = null;
let isDutch = false;
let score = 0;

playAudioBtn.addEventListener('click', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    isDutch = Math.random() < 0.5;
    const wordList = isDutch ? dutchWords : drunkSounds;
    const selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
    
    currentAudio = new Audio(selectedWord.audio);
    currentAudio.play();
    
    // Disable guess buttons while audio is playing
    guessButtons.forEach(btn => btn.disabled = true);
    
    currentAudio.onended = () => {
        guessButtons.forEach(btn => btn.disabled = false);
    };
});

guessButtons.forEach(button => {
    button.addEventListener('click', () => {
        const guess = button.dataset.guess;
        const correct = (guess === 'dutch' && isDutch) || (guess === 'drunk' && !isDutch);
        
        if (correct) {
            score++;
            alert(`Correct! 🎉 Your score: ${score}`);
        } else {
            alert('Wrong! Take a shot! 🍻');
        }
        
        // Reset audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
    });
});

// Dares Section - Wheel
const challenges = [
    "Steal a hat. Wear it for 10 mins.",
    "Find the worst dancer. Challenge them.",
    "Yell 'LONG LIVE THE KING' in a silent crowd.",
    "Trade an item with a stranger.",
    "Get a selfie with someone in a full orange suit.",
    "Dance with a police officer.",
    "Start a conga line.",
    "Trade clothes with a stranger.",
    "Sing the Dutch national anthem.",
    "Propose to a random person.",
    "Start a flash mob.",
    "Get a tattoo (temporary)."
];

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const result = document.getElementById('result');
const challengeText = document.getElementById('challenge-text');
const nextSpinBtn = document.getElementById('next-spin');

let ctx = null;
let centerX = 0;
let centerY = 0;
let radius = 0;
let currentRotation = 0;
let isSpinning = false;

function initWheel() {
    if (!wheel) return;
    
    // Set initial size
    wheel.width = 300;
    wheel.height = 300;
    
    centerX = wheel.width / 2;
    centerY = wheel.height / 2;
    radius = Math.min(centerX, centerY) - 10;
    
    ctx = wheel.getContext('2d');
    drawWheel();
    
    // Add event listeners
    spinBtn.addEventListener('click', spinWheel);
    nextSpinBtn.addEventListener('click', () => {
        result.classList.add('hidden');
        nextSpinBtn.classList.add('hidden');
    });
}

function resizeWheel() {
    if (!wheel) return;
    
    const container = wheel.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight);
    wheel.width = size;
    wheel.height = size;
    
    centerX = wheel.width / 2;
    centerY = wheel.height / 2;
    radius = Math.min(centerX, centerY) - 10;
    
    ctx = wheel.getContext('2d');
    drawWheel();
}

function drawWheel() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, wheel.width, wheel.height);
    
    const sliceAngle = (2 * Math.PI) / challenges.length;
    
    challenges.forEach((challenge, index) => {
        const startAngle = index * sliceAngle + currentRotation;
        const endAngle = startAngle + sliceAngle;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = index % 2 === 0 ? '#FF6B00' : '#FFA500';
        ctx.fill();
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Poppins';
        ctx.fillText(challenge.split(' ')[0], radius - 10, 5);
        ctx.restore();
    });
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    result.classList.add('hidden');
    
    const spinAngle = 3600 + Math.random() * 360; // 10 full rotations + random
    const spinDuration = 5000; // 5 seconds
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const currentProgress = easeOut(progress);
        
        currentRotation = (spinAngle * currentProgress * Math.PI) / 180;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            showResult();
        }
    }
    
    requestAnimationFrame(animate);
}

function showResult() {
    const sliceAngle = (2 * Math.PI) / challenges.length;
    const normalizedRotation = currentRotation % (2 * Math.PI);
    const selectedIndex = Math.floor(normalizedRotation / sliceAngle);
    const selectedChallenge = challenges[selectedIndex];
    
    challengeText.textContent = selectedChallenge;
    result.classList.remove('hidden');
    nextSpinBtn.classList.remove('hidden');
}

// Initialize wheel when the dares section is shown
document.querySelector('[data-section="dares"]').addEventListener('click', () => {
    if (!ctx) {
        initWheel();
    }
});

// Add resize listener
window.addEventListener('resize', resizeWheel);

// Gallery Section
const photoUpload = document.getElementById('photo-upload');
const photoGallery = document.getElementById('photo-gallery');
let uploadedPhotos = [];

photoUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Blackmail Photo';
            
            // Add delete button
            const photoContainer = document.createElement('div');
            photoContainer.className = 'photo-container';
            photoContainer.appendChild(img);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-photo';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = () => {
                photoContainer.remove();
                uploadedPhotos = uploadedPhotos.filter(photo => photo !== img);
            };
            photoContainer.appendChild(deleteBtn);
            
            photoGallery.appendChild(photoContainer);
            uploadedPhotos.push(img);
            
            // Add animation
            photoContainer.style.animation = 'fadeIn 0.5s ease-in';
        };
        reader.readAsDataURL(file);
    }
});

// Emergency Mode
const emergencyBtn = document.getElementById('emergency-btn');
const emergencyOptions = document.getElementById('emergency-options');
const findMateBtn = document.getElementById('find-mate');
const shotRouletteBtn = document.getElementById('shot-roulette');
const stupidBetBtn = document.getElementById('stupid-bet');

const emergencySounds = {
    findMate: new Audio('https://freesound.org/data/previews/131/131142_2337290-lq.mp3'),
    shot: new Audio('https://freesound.org/data/previews/131/131142_2337290-lq.mp3'),
    bet: new Audio('https://freesound.org/data/previews/131/131142_2337290-lq.mp3')
};

emergencyBtn.addEventListener('click', () => {
    emergencyOptions.classList.toggle('hidden');
});

findMateBtn.addEventListener('click', () => {
    emergencySounds.findMate.play();
    alert('🔊 Playing Dutch folk song to find your mate!');
});

shotRouletteBtn.addEventListener('click', () => {
    const isWater = Math.random() < 1/6;
    emergencySounds.shot.play();
    alert(isWater ? '💧 It\'s water! You\'re safe!' : '🍻 Take a shot!');
});

stupidBetBtn.addEventListener('click', () => {
    const bets = [
        "Next person to say 'gezellig' owes a beer",
        "First person to fall over buys shots",
        "Last person to check their phone gets a free drink",
        "Next person to take a selfie owes a round",
        "First person to start dancing buys the next round"
    ];
    const randomBet = bets[Math.floor(Math.random() * bets.length)];
    emergencySounds.bet.play();
    alert(`🎲 New bet: ${randomBet}`);
});

// Initial setup
function init() {
    // Initialize wheel
    if (wheel) {
        initWheel();
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', init); 