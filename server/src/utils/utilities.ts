const roomCodeLength = 10;
const letters = "BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz"

export const GenRoomCode = () => {
    let result = ""
    let numLetters = letters.length;
    for(let i=0; i < roomCodeLength; i++){
        let rand = Math.floor(Math.random() * (numLetters-1))
        result+= letters[rand]
    }
    return  result;
}