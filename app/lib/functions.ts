export function formatNumber(num: number): string {
    if (num < 1000) return num.toString();

    const units = ["", "K", "M", "B"];
    const index = Math.floor(Math.log10(num) / 3);
    const unit = units[index];
    const scaled = num / Math.pow(1000, index);

    return `${scaled.toFixed(1).replace(/\.0$/, "")}${unit}`;
}