export function getRandomShiftNum() {
  return Math.floor(Math.random() * 5) + 1;
}

export function encrypt(text, shift) {
  let encodedText = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-z]/i)) {
      // Checks if the character is a letter, case insensitive
      const base =
        char === char.toLowerCase() ? "a".charCodeAt(0) : "A".charCodeAt(0);
      const code = ((char.charCodeAt(0) - base + shift + 26) % 26) + base;
      encodedText += String.fromCharCode(code);
    } else {
      encodedText += char;
    }
  }
  return encodedText;
}

export function decrypt(text, shift) {
  return encrypt(text, -shift);
}
