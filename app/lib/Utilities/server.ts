export * as Authentication from "./ServerFunctions/Authentication";

export function GetUserInfoServer(userSchema: any) {
    const {passwordHash, __v, _id, ...userData} = userSchema.toObject();
    return userData;
}

export function GetPublicUserProfileServer(userSchema: any) {
    const userData = GetUserInfoServer(userSchema)
    const {sessions, email, discord, isEmailVerified, ...publicUserData} = userData;
    return publicUserData
}

export function Test() {
    return true
}

