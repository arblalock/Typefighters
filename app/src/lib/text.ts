export const getTxt = (msg: dictonary, lang = "eng"):  string =>{
    switch(lang){
        case "eng":
            return english[msg];
        default:
            return english[msg];
    }
}

type dictonary = 
    "ErrTooManyPlayers" |
    "Loading" |
    "FriendJoinWaiting" |
    "FriendWaitReady" |
    "FriendReady" |
    "MatchReady" |
    "ReadyBtn"
    ;


const english: Record<dictonary, string> = {
    ErrTooManyPlayers : `There was an error joining game. 
    This could be caused by too many players trying to join the game. 
    If problem persists try creating new game.`,
    Loading : "Loading",
    FriendJoinWaiting: "Waiting for friend to join...",
    FriendWaitReady: "Friend joined, waiting for them to be ready...",
    FriendReady: "Friend ready to start!",
    MatchReady: "Match Ready!",
    ReadyBtn : "Click when ready"
}