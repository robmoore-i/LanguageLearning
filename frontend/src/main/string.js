// The below two functions come from:
// https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
export function isLowercaseLetter(str) {
    return str.length === 1 && str.charCodeAt(0) > 96 && str.charCodeAt(0) < 123
}

export function isOneDigitNumber(str) {
    return str.length === 1 && str.charCodeAt(0) > 47 && str.charCodeAt(0) < 58
}
