export const rankInfo = [
    {id : -1, name : "None"},
    {id : 1, name : "Members"},
    {id : 204, name : "Help Forums Moderator"},
    {id : 305, name : "Marketplace Moderator"},
    {id : 401, name : "Moderator"},
    {id : 402, name : "Application Reviewer"},
    {id : 406, name : "Administrator"},
    {id : 520, name : "Developer"},
    {id : 708, name : "Director"},
    {id : 904, name : "CFO"},
    {id : 905, name : "CEO"},
]

export const PERMISSIONS = [
    "EDIT_RANK_PERMISSION",
    "TERMINATE_USER",
    "DELETE_CARD",
    "DELETE_PORTFOLIO",
    "RANK_USER",
]

class RankManger {
    rankID : number
    constructor(rankID : number) {
        this.rankID = rankID;
    }
    getRankInfo() {
        const info = rankInfo.filter((val) => val.id == this.rankID);
        if(info.length > 0) {
            return info[0];
        }
    }
    async getRankPermissions() {

    }
}