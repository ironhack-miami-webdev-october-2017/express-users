const bcrypt = require("bcrypt");


// ENCRYPTING A PASSWORD -------------------------------------------------------
// -----------------------------------------------------------------------------

// 1) generate a salt
const saltA = bcrypt.genSaltSync(30);

// 2) encrypt the password (a.k.a. "hash" the password)
const scrambledPassA = bcrypt.hashSync("swordfish", saltA);


console.log("Password A (swordfish)");
console.log(`              salt: ${saltA}`);
console.log(`encrypted password: ${scrambledPassA}`);


console.log("");


// VERIFYING A PASSWORD --------------------------------------------------------
// -----------------------------------------------------------------------------
console.log("Compare with swordfish (should be true)");
console.log( bcrypt.compareSync("swordfish", scrambledPassA) );


console.log("Compare with blah (should be false)");
console.log( bcrypt.compareSync("blah", scrambledPassA) );
