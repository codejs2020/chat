
exports.checkIfUserIsKnown = (ip, userList) => {
    let knownUsersIPs = []
    for (let user of userList) {
        knownUsersIPs.push(user.ip)
    }
    return knownUsersIPs.includes(ip)
}

exports.jsonParseWithErrorCheck = json => {
    let ret
    try {
        ret = JSON.parse(json)
    } catch (e) {
        ret = []
    }
    return ret
}

