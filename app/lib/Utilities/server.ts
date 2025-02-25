export * as Authentication from "./ServerFunctions/Authentication";

export function GetUserInfoServer(userSchema: any) {
    const {passwordHash, __v, _id, ...userData} = userSchema.toObject();
    return userData;
}

export function Test() {
    return true
}

