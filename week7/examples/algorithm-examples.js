// Week 7 - Algorithm Examples
// Contoh implementasi algoritma yang dipelajari di Week 7

console.log("=== Week 7 - Algorithm Examples ===\n");

// 1. Insertion Sort Algorithm
function insertionSort(arr) {
    console.log("Original array:", arr);
    
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    
    console.log("Sorted array:", arr);
    return arr;
}

// Test insertion sort
const numbers = [5, 3, 1, 4, 2];
insertionSort([...numbers]); // Use spread to avoid mutating original

console.log("\n" + "=".repeat(50) + "\n");

// 2. Binary Search Algorithm
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid; // Found the target
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Target not found
}

// Test binary search
const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 7;
const result = binarySearch(sortedArray, target);

console.log(`Searching for ${target} in [${sortedArray.join(', ')}]`);
console.log(`Result: ${result !== -1 ? `Found at index ${result}` : 'Not found'}`);

console.log("\n" + "=".repeat(50) + "\n");

// 3. Factorial with Recursion
function factorial(n) {
    // Base case
    if (n <= 1) {
        return 1;
    }
    
    // Recursive case
    return n * factorial(n - 1);
}

// Test factorial
const num = 5;
console.log(`Factorial of ${num}: ${factorial(num)}`);

console.log("\n" + "=".repeat(50) + "\n");

// 4. Fibonacci Sequence
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test fibonacci
console.log("Fibonacci sequence (first 10 numbers):");
for (let i = 0; i < 10; i++) {
    console.log(`F(${i}) = ${fibonacci(i)}`);
}

console.log("\n" + "=".repeat(50) + "\n");

// 5. Palindrome Checker
function isPalindrome(str) {
    // Remove spaces and convert to lowercase
    const cleaned = str.toLowerCase().replace(/\s/g, '');
    
    // Compare with reversed string
    return cleaned === cleaned.split('').reverse().join('');
}

// Test palindrome
const testStrings = ["racecar", "hello", "A man a plan a canal Panama", "level"];
testStrings.forEach(str => {
    console.log(`"${str}" is ${isPalindrome(str) ? 'a palindrome' : 'not a palindrome'}`);
});

console.log("\n=== End of Algorithm Examples ===");
