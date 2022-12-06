export function addGuardian(userAddress, guardian) {

    var user = getOrDefault(userAddress);

    if (user.guardians == null) {
        user.guardians = [];
    }

    user.guardians.push(guardian);
    localStorage.setItem(userAddress, JSON.stringify(user));

    var guardians = localStorage.getItem("guardians");
    if (guardians == null) {
        guardians = JSON.parse("{}");
    } else guardians = JSON.parse(guardians);

    console.log(guardians);
    guardians[guardian.address] = userAddress;


    localStorage.setItem("guardians", JSON.stringify(guardians));
}

export function getOrDefault(userAddress) {
    var user = localStorage.getItem(userAddress);
    if (user != null) {
        user = JSON.parse(user);
    } else {
        user = JSON.parse("{}");
        user.address = userAddress;
        user.accountStatus = "INIT";
    }

    return user;
}

export function getAccountStatus(userAddress) {
    console.log(userAddress);
    var user = getOrDefault(userAddress);

    return user.accountStatus;
}

export function secureSecret(userAddress, shares) {
    var user = localStorage.getItem(userAddress);
    if (user != null) {
        user = JSON.parse(user);
    } else user = JSON.parse("{}");

    if (user.guardians == null) {
        user.guardians = [];
    }
    console.log(user.guardians);
    for (var i in user.guardians) {

        user.guardians[i].secret = shares[i];
        user.guardians[i].status = "LOCKED";
    }
    user.accountStatus = "LOCKED";

    localStorage.setItem(userAddress, JSON.stringify(user));
}

export function getPending(userAddress) {
    return getInStorage("pendingAccess")[userAddress];
}

export function getSecrets(userAddress) {
    var user = localStorage.getItem(userAddress);
    if (user != null) {
        user = JSON.parse(user);
    } else user = JSON.parse("{}");

    if (user.guardians == null) {
        user.guardians = [];
    }
    var secrets = [];
    console.log(user.guardians);
    for (var i in user.guardians) {
        if (user.guardians[i].status == "UNLOCK") {
            secrets.push(user.guardians[i].unlockedSecret);
        }
    }

    return secrets;
}

export function confirmGuardian(userAddress, guardianAddress) {
    var user = localStorage.getItem(userAddress);

    if (user != null) {
        user = JSON.parse(user);
    } else user = JSON.parse("{}");

    var guardians = user.guardians;
    if (guardians == null)
        guardians = [];

    for (var g in guardians) {
        if (guardians[g].address == guardianAddress) {
            guardians[g].status = "CONFIRMED";
        }
    }
    console.log(user);
    localStorage.setItem(userAddress, JSON.stringify(user));
    return guardians;
}

export function getUserFromGuardian(guardianAddress){

   return getInStorage("guardians")[guardianAddress];
}


export function getInStorage(key) {
    var value = localStorage.getItem(key);
    if (value != null) {
        value = JSON.parse(value);
    } else value = JSON.parse("{}");
    return value
}

export function unlockGuardian(userNewAddress, guardianAddress) {
    var guardians = getInStorage("guardians");

    var userAddress = guardians[guardianAddress];

    var user = getOrDefault(userAddress);
    console.log("la");
    for (var g in user.guardians) {
        if (user.guardians[g].address == guardianAddress) {
            user.guardians[g].status = "UNLOCK";
            user.guardians[g].unlockedSecret = user.guardians[g].secret;
        }
    }

    if (user.accountStatus != "PENDING_UNLOCK") {
        user.accountStatus = "PENDING_UNLOCK";
        user.newAddress = userNewAddress;
        var pendingAccess = localStorage.getItem("pendingAccess");
        if (pendingAccess != null) {
            pendingAccess = JSON.parse(pendingAccess);
        } else pendingAccess = JSON.parse("{}");
        pendingAccess[userNewAddress] = userAddress;
        localStorage.setItem("pendingAccess", JSON.stringify(pendingAccess));
    }

    localStorage.setItem(userAddress, JSON.stringify(user));

}

export function getGuardians(userAddress) {
    console.log(userAddress);
    var user = localStorage.getItem(userAddress);

    if (user != null) {
        user = JSON.parse(user);
    } else user = JSON.parse("{}");

    var guardians = user.guardians;
    if (guardians == null)
        guardians = [];
    return guardians;
}

export function revokeGuardian(userAddress, guardianAddress) {
    var user = localStorage.getItem(userAddress);
    if (user != null) {
        user = JSON.parse(user);
    } else user = JSON.parse("{}");

    if (user.guardians == null) {
        user.guardians = [];
    }

    for (var i = 0; i < user.guardians.length; i++) {
        if (user.guardians[i].address == guardianAddress) {
            user.guardians.splice(i, 1);
        }
    }

    console.log("revoked");
    localStorage.setItem(userAddress, JSON.stringify(user));
}
