export const getUnderscoreDate = () => new Date().toISOString().split("T")[0].replace(/-/gm, "_")