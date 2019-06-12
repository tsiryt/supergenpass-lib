/*!
 * SuperGenPass library
 * https://github.com/chriszarate/supergenpass-lib
 * https://chriszarate.github.com/supergenpass/
 * License: GPLv2
 */

import ripemd160 from 'crypto-js/ripemd160';
import sha3 from 'crypto-js/sha3';


// Compute hexadecimal hash and convert it to custom Base.
function customBaseHash(str, hashFunction , charset) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const spec = "+@-_=$£*?./!:>%";
  var alphabet = (charset[0]?letters:"")+(charset[1]?caps:"")+(charset[2]?numbers:"")+(charset[3]?spec:"");
  var n = parseInt(Math.log2(alphabet.length)+1);
  var resultat = "";  
  var binaryWord = parseInt(hashFunction(str).toString(),16).toString(2);
  while(binaryWord.length>n){
    var x = binaryWord.substring(0,n);
    x = parseInt(parseInt(x,2).toString(10));
    if(x<alphabet.length){
      resultat+=alphabet[x];
      binaryWord = binaryWord.slice(n);
    }else{
      binaryWord = binaryWord.slice(1);
    }
  }
return resultat;
}

const hashFunctions = {
  ripemd160: (str, charset) => customBaseHash(str, ripemd160, charset),
  sha3: (str, charset) => customBaseHash(str, sha3, charset),
};

// Return a hash function for SGP to use.
function hash(method) {
  // Is user supplies a function, use it and assume they will take of any
  // encoding (Base-64 or otherwise).
  if (typeof method === 'function') {
    return method;
  }

  if (hashFunctions.hasOwnProperty(method)) {
    return hashFunctions[method];
  }

  throw new Error(`Could not resolve hash function, received ${typeof method}.`);
}

export default hash;
