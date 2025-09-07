// Week 7 - Practice Exercises
// Latihan untuk menguji pemahaman materi Week 7

console.log("=== Week 7 - Practice Exercises ===\n");

// Exercise 1: Bubble Sort Implementation
console.log("Exercise 1: Implement Bubble Sort");
console.log("Instructions: Complete the bubbleSort function below");

function bubbleSort(arr) {
    // TODO: Implement bubble sort algorithm
    // Hint: Compare adjacent elements and swap if they are in wrong order
    // Repeat until no more swaps are needed
    
    const n = arr.length;
    
    // Your code here
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    
    return arr;
}

// Test your implementation
const testArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", testArray);
console.log("Sorted array:", bubbleSort([...testArray]));

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 2: Linear Search Implementation
console.log("Exercise 2: Implement Linear Search");
console.log("Instructions: Complete the linearSearch function below");

function linearSearch(arr, target) {
    // TODO: Implement linear search algorithm
    // Hint: Check each element one by one until you find the target
    
    // Your code here
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Return index if found
        }
    }
    
    return -1; // Return -1 if not found
}

// Test your implementation
const searchArray = [10, 20, 30, 40, 50, 60, 70];
const searchTarget = 40;
const searchResult = linearSearch(searchArray, searchTarget);
console.log(`Searching for ${searchTarget} in [${searchArray.join(', ')}]`);
console.log(`Result: ${searchResult !== -1 ? `Found at index ${searchResult}` : 'Not found'}`);

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 3: Power Function with Recursion
console.log("Exercise 3: Implement Power Function with Recursion");
console.log("Instructions: Complete the power function below");

function power(base, exponent) {
    // TODO: Implement power function using recursion
    // Hint: base^exponent = base * base^(exponent-1)
    // Base case: when exponent is 0, return 1
    
    // Your code here
    if (exponent === 0) {
        return 1; // Base case
    }
    
    return base * power(base, exponent - 1); // Recursive case
}

// Test your implementation
const base = 2;
const exp = 5;
console.log(`${base}^${exp} = ${power(base, exp)}`);

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 4: Array Sum with Reduce
console.log("Exercise 4: Array Sum using Reduce");
console.log("Instructions: Complete the arraySum function below");

function arraySum(arr) {
    // TODO: Implement array sum using reduce method
    // Hint: Use reduce to accumulate the sum
    
    // Your code here
    return arr.reduce((sum, current) => sum + current, 0);
}

// Test your implementation
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(`Sum of [${numbers.join(', ')}] = ${arraySum(numbers)}`);

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 5: String Reversal
console.log("Exercise 5: String Reversal");
console.log("Instructions: Complete the reverseString function below");

function reverseString(str) {
    // TODO: Implement string reversal
    // Hint: You can use split, reverse, and join methods
    
    // Your code here
    return str.split('').reverse().join('');
}

// Test your implementation
const testString = "Hello World";
console.log(`Original: "${testString}"`);
console.log(`Reversed: "${reverseString(testString)}"`);

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 6: Object Deep Copy
console.log("Exercise 6: Object Deep Copy");
console.log("Instructions: Complete the deepCopy function below");

function deepCopy(obj) {
    // TODO: Implement deep copy for objects
    // Hint: Handle different data types (objects, arrays, primitives)
    
    // Your code here
    if (obj === null || typeof obj !== 'object') {
        return obj; // Return primitive values as is
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepCopy(item));
    }
    
    if (typeof obj === 'object') {
        const copiedObj = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                copiedObj[key] = deepCopy(obj[key]);
            }
        }
        return copiedObj;
    }
}

// Test your implementation
const originalObj = {
    name: "John",
    age: 30,
    hobbies: ["reading", "coding"],
    address: {
        street: "123 Main St",
        city: "New York"
    }
};

const copiedObj = deepCopy(originalObj);
copiedObj.name = "Jane";
copiedObj.hobbies.push("swimming");
copiedObj.address.city = "Los Angeles";

console.log("Original object:", originalObj);
console.log("Copied object:", copiedObj);
console.log("Deep copy successful:", originalObj.name !== copiedObj.name);

console.log("\n=== End of Practice Exercises ===");

// Additional Challenge Exercises (Optional)
console.log("\n" + "=".repeat(50));
console.log("=== Additional Challenge Exercises (Optional) ===");

// Challenge 1: Merge Two Sorted Arrays
console.log("\nChallenge 1: Merge Two Sorted Arrays");
function mergeSortedArrays(arr1, arr2) {
    // TODO: Merge two sorted arrays into one sorted array
    // Hint: Use two pointers technique
    
    const merged = [];
    let i = 0, j = 0;
    
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            merged.push(arr1[i]);
            i++;
        } else {
            merged.push(arr2[j]);
            j++;
        }
    }
    
    // Add remaining elements
    while (i < arr1.length) {
        merged.push(arr1[i]);
        i++;
    }
    
    while (j < arr2.length) {
        merged.push(arr2[j]);
        j++;
    }
    
    return merged;
}

const arr1 = [1, 3, 5, 7];
const arr2 = [2, 4, 6, 8];
console.log(`Merging [${arr1.join(', ')}] and [${arr2.join(', ')}]`);
console.log(`Result: [${mergeSortedArrays(arr1, arr2).join(', ')}]`);

console.log("\n=== End of Challenge Exercises ===");
