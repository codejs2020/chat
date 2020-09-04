
exports.checkIfUserIsKnown = (ip, userList) => {
    let knownUsersIPs = []
    for (let user of userList) {
        knownUsersIPs.push(user.ip)
    }
    return knownUsersIPs.includes(ip)
}
