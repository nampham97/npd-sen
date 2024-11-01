export function CheckRole(pathname: string) {
    const userNPDSEN = localStorage.getItem("user_NPDSEN");
    if (userNPDSEN) {
        const team = userNPDSEN.split("_")[0];
        if (team === "teamba" && pathname.startsWith("/team-ba")) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}