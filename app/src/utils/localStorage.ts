import { PlayerData } from "@/common/game";

const playerDataKey = "playerData";

export const LocalStorageGetPlayerData = () : PlayerData | null => {
    let result = localStorage.getItem(playerDataKey);
    return result ? PlayerData.PlayerDataFromJSON(result) : null;
}

export const LocalStorageStorePlayerData = (pd: PlayerData) => {
    localStorage.setItem(playerDataKey, pd.getPlayerJSON());
}

