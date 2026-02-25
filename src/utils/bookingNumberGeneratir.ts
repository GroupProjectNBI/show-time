export default function generate() {
    let letters = '';
    let numbers = '';

    const letterChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';

    // Slumpa 3 bokstäver
    while (letters.length < 3) {
        letters += letterChars[Math.floor(Math.random() * letterChars.length)];
    }

    // Slumpa 3 siffror
    while (numbers.length < 3) {
        numbers += numberChars[Math.floor(Math.random() * numberChars.length)];
    }

    // Returnera med bindestreck
    return `${letters}-${numbers}`;
}