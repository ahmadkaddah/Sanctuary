const audioFiles = [
    {
        src: 'audio/_وقل_رب_أعوذ_بك_من_همزات_الشياطين_ياسر_الدوسري_.mp3',
        surah: 'سورة المؤمنون',
        reader: 'ياسر الدوسري',
        verse: 'وَقُل رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ ۝ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ'
    },
    {
        src: 'audio/وقل_رب_أعوذ_بك_من_همزات_الشياطين_اسلام_صبحب.mp3',
        surah: 'سورة المؤمنون',
        reader: 'إسلام صبحي',
        verse: 'وَقُل رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ ۝ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ'
    },
    {
        src: 'audio/وقل_رب_أعوذ_بك_من_همزات_الشياطين_فارس_عباد.mp3',
        surah: 'سورة المؤمنون',
        reader: 'فارس عباد',
        verse: 'وَقُل رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ ۝ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ'
    },
    {
        src: 'audio/وقل_رب_أعوذ_بك_من_همزات_الشياطين_منصور_السالمي.mp3',
        surah: 'سورة المؤمنون',
        reader: 'منصور السالمي',
        verse: 'وَقُل رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ ۝ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ'
    }
];

const btn = document.getElementById('spiritual-btn');
const btnText = btn.querySelector('.btn-text');
const audioInfo = document.getElementById('audio-info');
const surahName = document.getElementById('surah-name');
const readerName = document.getElementById('reader-name');
const verseText = document.getElementById('verse-text');

const DEFAULT_TEXT = 'استجِرْ بالله';
const PLAYING_TEXT = 'استمع بإنصات...';

let currentAudio = null;
let lastPlayedIndex = -1;

btn.addEventListener('click', function (e) {
    createRipple(e, btn);

    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        resetButton();
    } else {
        playRandomAudio();
    }
});

function pickRandomIndex() {
    if (audioFiles.length === 1) return 0;
    let idx;
    do {
        idx = Math.floor(Math.random() * audioFiles.length);
    } while (idx === lastPlayedIndex);
    return idx;
}

function playRandomAudio() {
    const idx = pickRandomIndex();
    const item = audioFiles[idx];
    lastPlayedIndex = idx;

    if (currentAudio) { currentAudio.pause(); }
    currentAudio = new Audio(item.src);

    currentAudio.play()
        .then(() => {
            btnText.textContent = PLAYING_TEXT;
            btn.classList.add('playing');
            showInfo(item);
            currentAudio.addEventListener('ended', resetButton);
        })
        .catch(err => {
            console.error('Error playing audio:', err);
            alert('تعذر تشغيل الصوت. تأكد من وجود الملفات في مجلد audio.');
            resetButton();
        });
}

function showInfo(item) {
    surahName.textContent = item.surah;
    readerName.textContent = '— ' + item.reader;
    verseText.textContent = item.verse || '';
    audioInfo.classList.add('visible');
}

function resetButton() {
    btnText.textContent = DEFAULT_TEXT;
    btn.classList.remove('playing');
    audioInfo.classList.remove('visible');
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
}


function createRipple(event, element) {
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    const rect = element.getBoundingClientRect();
    const cx = (event.clientX ?? rect.left + radius) - rect.left - radius;
    const cy = (event.clientY ?? rect.top + radius) - rect.top - radius;

    const circle = document.createElement('span');
    circle.style.cssText = `width:${diameter}px;height:${diameter}px;left:${cx}px;top:${cy}px;`;
    circle.classList.add('ripple');
    element.querySelector('.ripple-container').appendChild(circle);
    setTimeout(() => circle.remove(), 600);
}


(function () {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, stars = [], animId;

    const STAR_COUNT = 140;
    const MAX_SIZE = 2.2;
    const MIN_SPEED = 0.08;
    const MAX_SPEED = 0.35;

    function getStarColor() { return '200,220,255'; }

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function randomStar() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * MAX_SIZE + 0.3,
            alpha: Math.random() * 0.7 + 0.2,
            speed: Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.005
        };
    }

    function init() { resize(); stars = Array.from({ length: STAR_COUNT }, randomStar); }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        const color = getStarColor();
        for (const s of stars) {
            s.twinkle += s.twinkleSpeed;
            const a = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color},${a})`;
            ctx.fill();
            s.y -= s.speed;
            if (s.y + s.r < 0) { s.y = H + s.r; s.x = Math.random() * W; }
        }
        animId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); draw(); });
    init(); draw();
})();


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(r => console.log('SW registered:', r.scope))
            .catch(e => console.log('SW failed:', e));
    });
}
