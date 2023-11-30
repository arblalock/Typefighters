const roomCodeLength = 10;
const dict = "bcdfghjklmnpqrstvwxyz1234567890"

export const GenRoomCode = () => {
    let result = ""
    let numLetters = dict.length;
    for(let i=0; i < roomCodeLength; i++){
        let rand = Math.floor(Math.random() * (numLetters-1))
        result+= dict[rand]
    }
    return  result;
}