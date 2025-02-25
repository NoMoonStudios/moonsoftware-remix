export function Test() {
    return true
}

export async function GetUserSession() {
    try {
        const res = await fetch("/api/v1/auth/session");
        if (!res.ok) return;
        return await res.json();
    } catch(er) {
        return
    }
}