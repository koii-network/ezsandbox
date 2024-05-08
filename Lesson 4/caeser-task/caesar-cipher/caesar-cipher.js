class CaesarCipher {
  static getRandomShiftNum() {
    return Math.floor(Math.random() * 5) + 1;
  }

  encode(text, shift) {
    let encodedText = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        // Checks if the character is a letter, case insensitive
        const base =
          char === char.toLowerCase() ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
        const code = ((char.charCodeAt(0) - base + shift + 26) % 26) + base;
        encodedText += String.fromCharCode(code);
      } else {
        encodedText += char;
      }
    }
    return encodedText;
  }

  static encrypt(text, shift) {
    return this.encode(text, shift);
  }

  static decrypt(text, shift) {
    return this.encode(text, -shift);
  }
}

module.exports = CaesarCipher;
