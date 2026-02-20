export const playSound = (type: 'correct' | 'incorrect') => {
  try {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.volume = 0.4; // Slightly lower volume for professional feel
    audio.play().catch(() => {}); // Ignore auto-play errors
  } catch (err) {
    console.error(err);
  }
};