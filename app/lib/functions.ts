export function formatNumber(num: number): string {
    if (num < 1000) return num.toString();

    const units = ["", "K", "M", "B"];
    const index = Math.floor(Math.log10(num) / 3);
    const unit = units[index];
    const scaled = num / Math.pow(1000, index);

    return `${scaled.toFixed(1).replace(/\.0$/, "")}${unit}`;
}

export function isStrictValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export function validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
    return usernameRegex.test(username);
}

export function generateRandomString(length : number) : string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function generateInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const blacklistedUsernames = [
    "moonsoftwares",
    "moonsoftware",
    "moon-software",
    "moon-softwares",
    "admin",
    "nomula",
    "syn",
    "synitx",
    "roblox"
]