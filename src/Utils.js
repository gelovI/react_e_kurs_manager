const existingIds = new Set();

export function GenerateUniqueId (parts = [4, 4, 4, 7, 4]) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let uniqueId;
    do {
        uniqueId = parts
            .map(part => Array.from({ length: part }, () => charset[Math.floor(Math.random() * charset.length)]).join(""))
            .join("-");
    } while (existingIds.has(uniqueId));
    existingIds.add(uniqueId);
    return uniqueId;
};