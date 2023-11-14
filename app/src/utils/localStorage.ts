const playerIDvar = "playerID";

export const LocalStorageGetPlayerID = () : string | null => {
    return localStorage.getItem(playerIDvar);
}

export const LocalStorageSetPlayerID = (pid: string) => {
    localStorage.setItem(playerIDvar, pid);
}

