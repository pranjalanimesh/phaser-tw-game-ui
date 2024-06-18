const  speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; // Japanese language
    console.log("utterance",utterance)
    window.speechSynthesis.speak(utterance);
  };

export { speakText };