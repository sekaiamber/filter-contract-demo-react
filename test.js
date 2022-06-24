const totp = require('otplib').authenticator

console.log(totp.generate('WQ4AGIFWW4B3QLDOG5DIN2EE6A'))
console.log(totp.generate('WQ4AGIFWW4B3QLDO'))

totp.options = { epoch: 0 }

console.log(totp.generate('WQ4AGIFWW4B3QLDOG5DIN2EE6A'))
console.log(totp.generate('WQ4AGIFWW4B3QLDO'))
