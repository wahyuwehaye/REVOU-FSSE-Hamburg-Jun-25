// Week 10 - Code Review Exercises
// Latihan untuk mengidentifikasi dan memperbaiki common mistakes

console.log("=== Week 10 - Code Review Exercises ===\n");

// Exercise 1: Fix Comparison Operators
console.log("Exercise 1: Fix Comparison Operators");
console.log("Instructions: Identify and fix the comparison operator issues");

// ❌ Problematic code (commented out to avoid errors)
/*
function checkAge(age) {
    if (age == 18) {
        return "Exactly 18";
    }
    if (age == "18") {
        return "String 18";
    }
    if (age == null) {
        return "Null age";
    }
    return "Other age";
}
*/

// ✅ Fixed code
function checkAge(age) {
    if (age === 18) {
        return "Exactly 18";
    }
    if (age === "18") {
        return "String 18";
    }
    if (age === null) {
        return "Null age";
    }
    return "Other age";
}

// Test the fixed function
console.log("Testing checkAge function:");
console.log("checkAge(18):", checkAge(18));
console.log("checkAge('18'):", checkAge('18'));
console.log("checkAge(null):", checkAge(null));
console.log("checkAge(25):", checkAge(25));

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 2: Fix String Concatenation
console.log("Exercise 2: Fix String Concatenation");
console.log("Instructions: Replace string concatenation with template literals");

// ❌ Problematic code (commented out)
/*
function createUserMessage(user) {
    return "Welcome " + user.name + "! You have " + user.points + " points and are level " + user.level + ".";
}
*/

// ✅ Fixed code
function createUserMessage(user) {
    return `Welcome ${user.name}! You have ${user.points} points and are level ${user.level}.`;
}

// Test the fixed function
const user = { name: "Alice", points: 1500, level: 5 };
console.log("User message:", createUserMessage(user));

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 3: Fix DOM Element Handling
console.log("Exercise 3: Fix DOM Element Handling");
console.log("Instructions: Add proper null checks for DOM elements");

// ❌ Problematic code (commented out)
/*
function updateScore(score) {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = score;
    scoreElement.style.color = 'green';
}
*/

// ✅ Fixed code
function updateScore(score) {
    const scoreElement = document.getElementById('score');
    
    if (scoreElement) {
        scoreElement.textContent = score;
        scoreElement.style.color = 'green';
    } else {
        console.error('Score element not found');
    }
}

// Simulate DOM element for testing
const mockDOM = {
    getElementById: function(id) {
        // Simulate element found/not found
        return id === 'score' ? { textContent: '', style: { color: '' } } : null;
    }
};

// Test the fixed function
console.log("Testing updateScore function:");
updateScore(1000);

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 4: Fix Variable Naming
console.log("Exercise 4: Fix Variable Naming");
console.log("Instructions: Improve variable names to be more descriptive");

// ❌ Problematic code (commented out)
/*
function calculateTotal(items) {
    let x = 0;
    let y = 0;
    let z = 0;
    
    for (let i = 0; i < items.length; i++) {
        x += items[i].price;
        y += items[i].tax;
        z += items[i].shipping;
    }
    
    return x + y + z;
}
*/

// ✅ Fixed code
function calculateTotal(items) {
    let subtotal = 0;
    let totalTax = 0;
    let totalShipping = 0;
    
    for (let i = 0; i < items.length; i++) {
        subtotal += items[i].price;
        totalTax += items[i].tax;
        totalShipping += items[i].shipping;
    }
    
    return subtotal + totalTax + totalShipping;
}

// Test the fixed function
const items = [
    { price: 100, tax: 10, shipping: 5 },
    { price: 200, tax: 20, shipping: 10 },
    { price: 150, tax: 15, shipping: 7 }
];

console.log("Testing calculateTotal function:");
console.log("Items:", items);
console.log("Total:", calculateTotal(items));

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 5: Add Proper Comments
console.log("Exercise 5: Add Proper Comments");
console.log("Instructions: Add meaningful comments to explain the code");

// ❌ Code without comments
function processUserData(users) {
    let activeUsers = [];
    let inactiveUsers = [];
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].lastLogin > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
            activeUsers.push(users[i]);
        } else {
            inactiveUsers.push(users[i]);
        }
    }
    
    return {
        active: activeUsers,
        inactive: inactiveUsers,
        total: users.length
    };
}

// ✅ Code with proper comments
function processUserDataWithComments(users) {
    // Initialize arrays to store active and inactive users
    let activeUsers = [];
    let inactiveUsers = [];
    
    // Calculate date 30 days ago for comparison
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Iterate through all users and categorize them
    for (let i = 0; i < users.length; i++) {
        // Check if user logged in within the last 30 days
        if (users[i].lastLogin > thirtyDaysAgo) {
            activeUsers.push(users[i]);
        } else {
            inactiveUsers.push(users[i]);
        }
    }
    
    // Return categorized user data with total count
    return {
        active: activeUsers,
        inactive: inactiveUsers,
        total: users.length
    };
}

// Test the function
const users = [
    { name: "Alice", lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }, // 10 days ago
    { name: "Bob", lastLogin: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) },   // 40 days ago
    { name: "Charlie", lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }  // 5 days ago
];

console.log("Testing processUserData function:");
console.log("Result:", processUserDataWithComments(users));

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 6: Implement Error Handling
console.log("Exercise 6: Implement Error Handling");
console.log("Instructions: Add proper error handling to the function");

// ❌ Code without error handling
function divideNumbers(a, b) {
    return a / b;
}

// ✅ Code with error handling
function divideNumbersSafe(a, b) {
    try {
        // Validate inputs
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        
        if (b === 0) {
            throw new Error('Division by zero is not allowed');
        }
        
        const result = a / b;
        console.log(`✅ Division successful: ${a} / ${b} = ${result}`);
        return result;
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        return null;
    } finally {
        console.log("Division operation completed");
    }
}

// Test the function with different inputs
console.log("Testing divideNumbersSafe function:");
divideNumbersSafe(10, 2);
divideNumbersSafe(10, 0);
divideNumbersSafe("10", 2);
divideNumbersSafe(10, "2");

console.log("\n" + "=".repeat(50) + "\n");

// Exercise 7: Fix Class Toggling
console.log("Exercise 7: Fix Class Toggling");
console.log("Instructions: Replace direct style manipulation with class toggling");

// ❌ Direct style manipulation (commented out)
/*
function toggleButton(button) {
    if (button.style.display === 'none') {
        button.style.display = 'block';
        button.style.backgroundColor = 'blue';
        button.style.color = 'white';
    } else {
        button.style.display = 'none';
    }
}
*/

// ✅ Class toggling approach
function toggleButtonWithClasses(button) {
    if (button.classList.contains('hidden')) {
        button.classList.remove('hidden');
        button.classList.add('active');
    } else {
        button.classList.add('hidden');
        button.classList.remove('active');
    }
}

// Simulate button element
const mockButton = {
    classList: {
        classes: new Set(),
        add: function(className) { 
            this.classes.add(className);
            console.log(`Added class: ${className}`);
        },
        remove: function(className) { 
            this.classes.delete(className);
            console.log(`Removed class: ${className}`);
        },
        contains: function(className) { 
            return this.classes.has(className);
        }
    }
};

console.log("Testing toggleButtonWithClasses function:");
toggleButtonWithClasses(mockButton);
toggleButtonWithClasses(mockButton);

console.log("\n=== End of Code Review Exercises ===");

// Summary of fixes applied
console.log("\n" + "=".repeat(50));
console.log("=== Summary of Fixes Applied ===");
console.log("1. ✅ Replaced == with === for strict comparison");
console.log("2. ✅ Used template literals instead of string concatenation");
console.log("3. ✅ Added null checks for DOM elements");
console.log("4. ✅ Improved variable names to be descriptive");
console.log("5. ✅ Added meaningful comments");
console.log("6. ✅ Implemented proper error handling");
console.log("7. ✅ Used class toggling instead of direct style manipulation");
console.log("\nThese fixes make the code more robust, maintainable, and follow best practices!");
