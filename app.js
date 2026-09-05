const video = document.querySelector('#cat-video');
const videoToggle = document.querySelector('#toggle-video');
const pauseIcon = videoToggle.querySelector('.pause-icon');
const resumeIcon = videoToggle.querySelector('.resume-icon');
const autoplayNote = document.querySelector('#autoplay-note');
const soundToggle = document.querySelector('#toggle-sound');
const videoError = document.querySelector('.video-error');
const letter = document.querySelector('#letter');
const letterButton = document.querySelector('#open-letter');
const message = document.querySelector('#warm-message');

const messages = [
  ['ты мой любимый человек.', 'даже в режиме картошечки.'],
  ['сегодня твой главный квест —', 'быть котиком в пледике.'],
  ['уровень моей нежности к тебе:', 'котик, который мнёт лапками.'],
  ['если бы объятия были файлами,', 'я бы отправил тебе целую папку.'],
  ['планы на сегодня:', 'ты отдыхаешь. я тебя обожаю.'],
  ['ты + плед + котики.', 'идеальный состав команды.'],
];
let messageIndex = 0;

// Start the requested quiet loop; the pause control remains available.
video.controls = false;
video.muted = true;
videoToggle.hidden = false;
soundToggle.hidden = false;

function updateSoundControl() {
  const soundEnabled = !video.muted;
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  soundToggle.querySelector('span').textContent = soundEnabled ? 'Выключить звук' : 'Включить звук';
  soundToggle.querySelector('.sound-off').toggleAttribute('hidden', soundEnabled);
  soundToggle.querySelector('.sound-on').toggleAttribute('hidden', !soundEnabled);
}
soundToggle.addEventListener('click', () => {
  video.muted = !video.muted;
  if (!video.muted && video.paused) startVideo();
  updateSoundControl();
});
video.addEventListener('volumechange', updateSoundControl);
updateSoundControl();

function updatePlaybackControl() {
  pauseIcon.toggleAttribute('hidden', video.paused);
  resumeIcon.toggleAttribute('hidden', !video.paused);
  videoToggle.setAttribute('aria-label', video.paused ? 'Включить котиков' : 'Приостановить котиков');
}

async function startVideo() {
  try {
    await video.play();
    autoplayNote.hidden = true;
  } catch {
    if (!video.error) autoplayNote.hidden = false;
  }
  updatePlaybackControl();
}

videoToggle.addEventListener('click', () => {
  if (video.paused) startVideo();
  else video.pause();
});
video.addEventListener('play', () => {
  autoplayNote.hidden = true;
  updatePlaybackControl();
});
video.addEventListener('pause', updatePlaybackControl);
video.addEventListener('error', () => {
  videoToggle.hidden = true;
  soundToggle.hidden = true;
  autoplayNote.hidden = true;
  videoError.hidden = false;
});
video.querySelector('source').addEventListener('error', () => {
  videoToggle.hidden = true;
  soundToggle.hidden = true;
  autoplayNote.hidden = true;
  videoError.hidden = false;
});

startVideo();
updatePlaybackControl();

document.querySelector('#more-warmth').addEventListener('click', () => {
  messageIndex = (messageIndex + 1) % messages.length;
  const [firstLine, secondLine] = messages[messageIndex];
  message.replaceChildren(document.createTextNode(firstLine), document.createElement('br'), document.createTextNode(secondLine));
});

let resumeAfterLetter = false;
letterButton.addEventListener('click', () => {
  resumeAfterLetter = !video.paused;
  video.pause();
  letter.showModal();
});
document.querySelector('.close-letter').addEventListener('click', () => letter.close());
document.querySelector('.close-letter-action').addEventListener('click', () => letter.close());
letter.addEventListener('click', (event) => {
  if (event.target !== letter) return;
  const bounds = letter.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) letter.close();
});
letter.addEventListener('close', () => {
  letterButton.focus({ preventScroll: true });
  if (resumeAfterLetter) startVideo();
});
