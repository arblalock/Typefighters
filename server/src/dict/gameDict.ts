export class GameDict {
    txt: Array<string>;

    constructor(){
        this.txt = ["This is a test sentence for the game.", 
        "This is yet another test sentence for the game.",]
    }

    //excludedIds are used to prevent showing previously shown text
    getRandomTxt(excludedIds: Array<Number>): GameTxtResult{
        let maxAttempts = this.txt.length;
        let attempt = 0;
        while(attempt < maxAttempts){
            let idx = this.randomRange(0, this.txt.length-1);
            if(excludedIds.indexOf(idx) === -1){
                return new GameTxtResult(this.txt[idx], idx);
            }
            attempt++;
        }
        //If we have gone through all text, just get a random one
        let idx = this.randomRange(0, this.txt.length-1)
        return new GameTxtResult(this.txt[idx], idx);
    }

    randomRange(min: number, max:number): number{
        return Math.floor(Math.random() * (max - min) + min);
    }
}

class GameTxtResult{
    txt: string
    idx: number
    constructor(txt: string, idx: number){
        this.txt = txt;
        this.idx = idx;
    }
}