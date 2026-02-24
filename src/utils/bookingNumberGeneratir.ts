export default function generate() {
    let confNum = '';
    while (confNum.length < 6) {
        confNum += randomCharacterFromString(
            confNum.length < 3 ?
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ' :
                '0123456789'
        )
    }
    return confNum;
}

function randomCharacterFromString(str: string) {
    return str[Math.floor(Math.random() * str.length)];
}