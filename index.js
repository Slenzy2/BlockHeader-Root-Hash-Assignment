const sha256 = require('sha256');

function createHash(x, y) {
  let finalHash;
  if (x && !y) {
    // Create a hash for one value
    const str = x.toString();
    finalHash = sha256(str);

    return finalHash;
  }

  // Create hash for two values
  const str1 = x.toString();
  const str2 = y.toString();
  const combined = `${str1}:${str2}`;
  finalHash = sha256(combined);

  return finalHash;
}

// Function to create a single hash from a list/array of transactions
function createBlockHash(trnxs) {
  let combinations = new Map();

  if (!Array.isArray(trnxs)) return null;
  if (trnxs.length === 0) return null;
  if (trnxs.length === 1) return createHash(trnxs[0]);

  for (let i = 0; i < trnxs.length; i += 2) {
    const currentTrxn = trnxs[i].toString();
    const nextTrxn = i + 1 < trnxs.length ? trnxs[i + 1].toString() : null;

    if (!nextTrxn) {
      // If no pair available, hash the single transaction
      const hash = createHash(currentTrxn);
      combinations.set(currentTrxn, hash);
    } else {
      // Hash the pair of transactions
      const hash = createHash(currentTrxn, nextTrxn);
      combinations.set(`${currentTrxn}:${nextTrxn}`, hash);
    }
  }

  return combineHashes(combinations);
}

// Recursive function to combine hashes until we get a single hash
function combineHashes(hashMap) {
  if (hashMap.size === 1) {
    return Array.from(hashMap.values())[0];
  }

  const newCombinations = new Map();
  const entries = Array.from(hashMap.values());

  for (let i = 0; i < entries.length; i += 2) {
    const currentHash = entries[i];
    const nextHash = i + 1 < entries.length ? entries[i + 1] : null;

    if (!nextHash) {
      newCombinations.set(currentHash, createHash(currentHash));
    } else {
      const combinedHash = createHash(currentHash, nextHash);
      newCombinations.set(`${currentHash}:${nextHash}`, combinedHash);
    }
  }
  return combineHashes(newCombinations);
}

// Test cases
console.log('Single value tests:');
console.log(createHash('hello'));

console.log('\nTwo value tests:');
console.log(createHash('hello', 'world'));

console.log('\nBlock Hash tests for odd number of transactions:');
const oddTransactions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
console.log(createBlockHash(oddTransactions));

console.log('\nBlock Hash tests for even number of transactions:');
const evenTransactions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
console.log(createBlockHash(evenTransactions));
