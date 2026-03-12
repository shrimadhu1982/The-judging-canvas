const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const promptEl = document.getElementById('prompt');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const judgeBtn = document.getElementById('judgeBtn');
const clearBtn = document.getElementById('clearBtn');

let drawing = false;
let timerInterval;
let typeInterval;

const challenges = [
    { text: "DRAW A [OBJ] USING ONLY TRIANGLES", items: ["DOG", "PIZZA", "CAR", "GHOST"] },
    { text: "DRAW A [OBJ] IN [TIME] SECONDS", items: ["PLANE", "CAKE", "SPIDER", "HOUSE"], times: [5, 10] },
    { text: "DRAW A [OBJ] WITH YOUR EYES CLOSED", items: ["SMILEY", "STAR", "HEART", "FISH"] },
    { text: "DRAW A [OBJ] WITHOUT LIFTING THE PEN", items: ["BOTTLE", "CAT", "MOUNTAIN"] }
];

const normalRoasts = [
    "IS THAT ART OR A CRY FOR HELP?",
    "WOW. I'VE SEEN BETTER LINES ON A BLANK PAGE.",
    "THIS IS WHY ALIENS WON'T TALK TO US.",
    "MY TODDLER VERSION DRAWS BETTER THAN THIS.",
    "IT'S BOLD, IT'S UNIQUE, IT'S ABSOLUTELY HIDEOUS.",
    "ERROR: TALENT NOT DETECTED IN THIS REGION.",
    "YOU ACTUALLY USED YOUR HANDS FOR THIS?",
    "A SQUASHED GRAPE HAS MORE ARTISTIC VISION.",
    "I'D WIPE THE CANVAS, BUT THE MEMORY REMAINS.",
    "IS IT UPSIDE DOWN? NO, IT'S JUST BAD.",
    "STOP. JUST STOP."
];

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function startPosition(e) { 
    drawing = true; 
    ctx.beginPath(); 
    const pos = getPos(e);
    ctx.moveTo(pos.x, pos.y); 
    draw(e); 
}

function endPosition() { 
    drawing = false; 
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;
    
    ctx.lineWidth = 5;
    ctx.lineCap = 'round'; 
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y); 
    ctx.stroke();
}

canvas.addEventListener('mousedown', startPosition);
window.addEventListener('mouseup', endPosition); 
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPosition(e); });
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });

function typeWriter(text) {
    let i = 0;
    if (typeInterval) clearInterval(typeInterval);
    
    promptEl.textContent = "";
    promptEl.classList.add('typing-cursor');
    
    typeInterval = setInterval(() => {
        promptEl.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(typeInterval);
            promptEl.classList.remove('typing-cursor');
        }
    }, 40);
}

function generateChallenge() {
    clearInterval(timerInterval);
    if (typeInterval) clearInterval(typeInterval);
    timerEl.innerText = "";
    clearCanvas();
    
    const randomC = challenges[Math.floor(Math.random() * challenges.length)];
    let finalPrompt = randomC.text;
    
    if (finalPrompt.includes("[OBJ]")) {
        const item = randomC.items[Math.floor(Math.random() * randomC.items.length)];
        finalPrompt = finalPrompt.replace("[OBJ]", item);
    }
    
    if (finalPrompt.includes("[TIME]")) {
        const time = randomC.times[Math.floor(Math.random() * randomC.times.length)];
        finalPrompt = finalPrompt.replace("[TIME]", time);
        startTimer(time);
    }
    
    promptEl.textContent = finalPrompt; 
    promptEl.classList.add('shake');
    setTimeout(() => promptEl.classList.remove('shake'), 300);
    drawing = true;
}

function startTimer(seconds) {
    let timeLeft = seconds;
    timerEl.innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerEl.innerText = "DONE.";
            drawing = false;
            triggerRoast();
        }
    }, 1000);
}

function triggerRoast() {
    const randomRoast = normalRoasts[Math.floor(Math.random() * normalRoasts.length)];
    typeWriter(randomRoast);
}

function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

startBtn.addEventListener('click', generateChallenge);
judgeBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerEl.innerText = "CRITIQUE:";
    drawing = false;
    triggerRoast();
});
clearBtn.addEventListener('click', () => {
    clearCanvas();
    if (typeInterval) clearInterval(typeInterval);
    promptEl.textContent = "CLEAN SLATE. TRY NOT TO RUIN IT.";
});