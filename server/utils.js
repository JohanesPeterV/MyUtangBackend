const bcrypt = require('bcrypt');

const saltRounds = 10;
var Utils = {
    bcryptPassword: function (password) {
        return new Promise(
            resolve => {
                bcrypt.genSalt(saltRounds, function (err, salt) {
                        bcrypt.hash(password, salt, function (err, hash) {
                            resolve(hash)
                        });
                    }
                );
            }
        )

    }
}

module.exports = Utils
