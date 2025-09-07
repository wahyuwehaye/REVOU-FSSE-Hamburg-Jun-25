// Week 10 - Best Practices Examples
// Contoh implementasi best practices yang dipelajari di Week 10

console.log("=== Week 10 - Best Practices Examples ===\n");

// 1. Comparison Operators - Always use === instead of ==
console.log("1. Comparison Operators:");
console.log("❌ Using == (with type coercion):");
console.log(0 == false);  // true (unexpected!)
console.log("" == 0);     // true (unexpected!)
console.log(null == undefined); // true (unexpected!)

console.log("\n✅ Using === (strict comparison):");
console.log(0 === false);  // false (expected!)
console.log("" === 0);     // false (expected!)
console.log(null === undefined); // false (expected!)

console.log("\n" + "=".repeat(50) + "\n");

// 2. Template Literals instead of String Concatenation
console.log("2. String Concatenation:");

const playerName = "Alice";
const score = 1500;
const level = 5;

console.log("❌ Using + concatenation:");
console.log("Player: " + playerName + " | Score: " + score + " | Level: " + level);

console.log("\n✅ Using template literals:");
console.log(`Player: ${playerName} | Score: ${score} | Level: ${level}`);

// Multi-line strings
console.log("\n✅ Multi-line template literal:");
console.log(`Player Information:
Name: ${playerName}
Score: ${score}
Level: ${level}
Status: ${score > 1000 ? 'Expert' : 'Beginner'}`);

console.log("\n" + "=".repeat(50) + "\n");

// 3. Null Checks for DOM Elements
console.log("3. DOM Element Null Checks:");

// Simulate DOM element selection
function simulateDOMSelection() {
    // This would be: const element = document.getElementById('myElement');
    const element = null; // Simulating element not found
    
    console.log("❌ Without null check:");
    // element.textContent = "This would cause an error!";
    console.log("Would cause: TypeError: Cannot set property 'textContent' of null");
    
    console.log("\n✅ With null check:");
    if (element) {
        element.textContent = "Safe to set content";
        console.log("Element found, content set safely");
    } else {
        console.log("Element not found, handling gracefully");
    }
}

simulateDOMSelection();

console.log("\n" + "=".repeat(50) + "\n");

// 4. Class Toggling instead of Direct Style Manipulation
console.log("4. Class Toggling vs Direct Style:");

// Simulate element with classList
const mockElement = {
    classList: {
        classes: new Set(),
        add: function(className) { this.classes.add(className); },
        remove: function(className) { this.classes.delete(className); },
        contains: function(className) { return this.classes.has(className); },
        toggle: function(className) { 
            if (this.classes.has(className)) {
                this.classes.delete(className);
            } else {
                this.classes.add(className);
            }
        }
    }
};

console.log("❌ Direct style manipulation:");
console.log("element.style.display = 'none';");
console.log("element.style.backgroundColor = 'red';");
console.log("element.style.color = 'white';");
console.log("Problems: Hard to maintain, not scalable, mixed concerns");

console.log("\n✅ Class toggling:");
mockElement.classList.add('hidden');
mockElement.classList.add('error-state');
console.log("element.classList.add('hidden');");
console.log("element.classList.add('error-state');");
console.log("Benefits: Separation of concerns, maintainable, scalable");

console.log("\n" + "=".repeat(50) + "\n");

// 5. Descriptive Variable Names
console.log("5. Variable Naming:");

console.log("❌ Poor naming:");
let a = 0;
let b = 0;
let temp = '';
let x = Math.floor(Math.random() * 3);
let y = ['rock', 'paper', 'scissors'][x];

console.log("Variables: a, b, temp, x, y");
console.log("Problems: Not descriptive, unclear purpose");

console.log("\n✅ Good naming:");
let playerScore = 0;
let computerScore = 0;
let currentResult = '';
let randomIndex = Math.floor(Math.random() * 3);
let computerChoice = ['rock', 'paper', 'scissors'][randomIndex];

console.log("Variables: playerScore, computerScore, currentResult, randomIndex, computerChoice");
console.log("Benefits: Self-documenting, clear purpose, easier to understand");

console.log("\n" + "=".repeat(50) + "\n");

// 6. Proper Comments
console.log("6. Commenting Best Practices:");

// ❌ Poor commenting
function badExample() {
    let x = 0;
    if (x >= 5) {
        // do something
    }
}

// ✅ Good commenting
function goodExample() {
    // Initialize player score
    let playerScore = 0;
    
    // Check if player has reached winning score
    if (playerScore >= 5) {
        // End game and show victory message
        console.log("Congratulations! You won!");
    }
}

console.log("❌ Poor comments: Vague, obvious, or missing");
console.log("✅ Good comments: Explain why, not what; clarify complex logic");

console.log("\n" + "=".repeat(50) + "\n");

// 7. Error Handling
console.log("7. Error Handling:");

function riskyOperation(data) {
    try {
        // Simulate risky operation
        if (!data) {
            throw new Error("Data is required");
        }
        
        if (typeof data !== 'string') {
            throw new Error("Data must be a string");
        }
        
        // Simulate processing
        const result = data.toUpperCase();
        console.log(`✅ Successfully processed: ${result}`);
        return result;
        
    } catch (error) {
        console.error(`❌ Error occurred: ${error.message}`);
        return null;
    } finally {
        console.log("Operation completed (cleanup code here)");
    }
}

// Test error handling
console.log("Testing with valid data:");
riskyOperation("hello world");

console.log("\nTesting with invalid data:");
riskyOperation(null);
riskyOperation(123);

console.log("\n=== End of Best Practices Examples ===");
