# Week 10 Assignment Review - Common Mistakes

## 📋 Overview

Dokumen ini merangkum common mistakes yang ditemukan dalam Milestone 2 Assignment (JavaScript Game Development) berdasarkan 3 skillset utama:

1. **JavaScript Problem-Solving**
2. **DOM Manipulation & Event Handling**
3. **Code Readability & Organization**

**Total Students Reviewed:** 13
**Assignment:** Milestone 2 - JavaScript Game Development

---

## 🎯 JavaScript Problem-Solving

### ✅ Criteria yang Dinilai

1. Uses basic conditional statements and loops correctly
2. Implements simple functions to structure code effectively
3. Uses arrays and objects to store and manipulate game data
4. Uses template literals for dynamic string construction
5. Implements simple mathematical operations for game mechanics
6. Uses logical operators correctly in decision-making
7. Applies switch statements where appropriate instead of multiple if-else

### ❌ Common Mistakes

#### 1. Conditional Statements dan Loops Tidak Tepat

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Kondisi yang tidak efisien atau redundant
if (score > 0) {
  if (score < 100) {
    // code
  }
}

// ✅ GOOD: Kondisi yang lebih efisien
if (score > 0 && score < 100) {
  // code
}
```

**Contoh Kesalahan Lain:**
- Menggunakan loop dengan kondisi yang tidak optimal
- Infinite loop karena kondisi exit tidak ada
- Tidak menggunakan `break` atau `continue` dengan tepat

**Recommendation:**
```javascript
// Gunakan kondisi yang clear dan efficient
for (let i = 0; i < items.length; i++) {
  if (items[i].isSelected) {
    processItem(items[i]);
    break; // Stop setelah menemukan item pertama
  }
}
```

**Students dengan issue ini:** 6/13 (46%)

---

#### 2. Fungsi Tidak Digunakan untuk Struktur Code yang Lebih Baik

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Code repetitive tanpa function
button1.addEventListener('click', () => {
  score += 10;
  scoreDisplay.textContent = `Score: ${score}`;
  localStorage.setItem('score', score);
});

button2.addEventListener('click', () => {
  score += 20;
  scoreDisplay.textContent = `Score: ${score}`;
  localStorage.setItem('score', score);
});

// ✅ GOOD: Menggunakan function untuk reusability
function updateScore(points) {
  score += points;
  scoreDisplay.textContent = `Score: ${score}`;
  localStorage.setItem('score', score);
}

button1.addEventListener('click', () => updateScore(10));
button2.addEventListener('click', () => updateScore(20));
```

**Impact:**
- Code menjadi sulit di-maintain
- DRY principle tidak diterapkan
- Sulit untuk debugging

**Students dengan issue ini:** 8/13 (62%)

---

#### 3. Arrays dan Objects Tidak Digunakan dengan Efektif

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Menggunakan variable terpisah
let player1Name = 'John';
let player1Score = 0;
let player1Lives = 3;

let player2Name = 'Jane';
let player2Score = 0;
let player2Lives = 3;

// ✅ GOOD: Menggunakan array of objects
const players = [
  { name: 'John', score: 0, lives: 3 },
  { name: 'Jane', score: 0, lives: 3 }
];

// Easy to iterate and manage
players.forEach(player => {
  console.log(`${player.name}: ${player.score} points`);
});
```

**Contoh Penggunaan yang Baik:**

```javascript
// Game state management
const gameState = {
  level: 1,
  score: 0,
  isPlaying: false,
  player: {
    x: 0,
    y: 0,
    health: 100
  },
  enemies: []
};
```

**Students dengan issue ini:** 7/13 (54%)

---

#### 4. Template Literals Tidak Digunakan

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: String concatenation
const message = 'Score: ' + score + ', Level: ' + level;
const html = '<div class="card">' + 
             '<h2>' + title + '</h2>' +
             '<p>' + description + '</p>' +
             '</div>';

// ✅ GOOD: Template literals
const message = `Score: ${score}, Level: ${level}`;
const html = `
  <div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
  </div>
`;
```

**Benefits:**
- Lebih readable
- Support multi-line strings
- Easy untuk expressions

**Students dengan issue ini:** 9/13 (69%)

---

#### 5. Mathematical Operations untuk Game Mechanics Kurang Tepat

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Hard-coded values, tidak scalable
function calculateDamage() {
  return 10; // Always the same
}

// ✅ GOOD: Dynamic calculations
function calculateDamage(baseDamage, level, critChance = 0.1) {
  let damage = baseDamage * (1 + (level * 0.1));
  
  // Critical hit chance
  if (Math.random() < critChance) {
    damage *= 2;
  }
  
  return Math.floor(damage);
}
```

**Contoh Lain:**

```javascript
// ❌ BAD: Tidak menggunakan Math functions
const randomNum = parseInt(Math.random() * 100);

// ✅ GOOD: Proper use of Math
const randomNum = Math.floor(Math.random() * 100);

// ✅ GOOD: Clamp values
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Ensure health stays between 0-100
player.health = clamp(player.health, 0, 100);
```

**Students dengan issue ini:** 5/13 (38%)

---

#### 6. Logical Operators Tidak Digunakan dengan Benar

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Nested if statements
if (hasKey) {
  if (doorLocked) {
    if (keyCorrect) {
      openDoor();
    }
  }
}

// ✅ GOOD: Logical operators
if (hasKey && doorLocked && keyCorrect) {
  openDoor();
}

// ❌ BAD: Redundant checks
if (score >= 100) {
  win = true;
} else {
  win = false;
}

// ✅ GOOD: Direct assignment
const win = score >= 100;
```

**Students dengan issue ini:** 6/13 (46%)

---

#### 7. Switch Statements Tidak Digunakan Saat Lebih Tepat

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Multiple if-else untuk value checking
if (userChoice === 'rock') {
  // code
} else if (userChoice === 'paper') {
  // code
} else if (userChoice === 'scissors') {
  // code
}

// ✅ GOOD: Switch statement
switch (userChoice) {
  case 'rock':
    // code
    break;
  case 'paper':
    // code
    break;
  case 'scissors':
    // code
    break;
  default:
    console.log('Invalid choice');
}
```

**Kapan menggunakan switch:**
- Checking single value dengan multiple possibilities
- Lebih dari 3-4 if-else conditions
- Lebih readable untuk discrete values

**Students dengan issue ini:** 10/13 (77%)

---

## 🖱️ DOM Manipulation & Event Handling

### ✅ Criteria yang Dinilai

1. Uses querySelector or getElementById to access elements
2. Adds event listeners (click, input) to handle user interactions
3. Updates text or styles dynamically using JavaScript
4. Changes element visibility dynamically
5. Uses class toggling for styling changes dynamically
6. Uses innerHTML and textContent appropriately
7. Handles form inputs and retrieves values correctly

### ❌ Common Mistakes

#### 1. Tidak Menggunakan Modern DOM Selection

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Using document.getElementsByClassName
const buttons = document.getElementsByClassName('btn'); // Returns HTMLCollection
buttons.forEach(btn => { /* ERROR! */ }); // Won't work!

// ✅ GOOD: Use querySelectorAll
const buttons = document.querySelectorAll('.btn'); // Returns NodeList
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick);
});

// ❌ BAD: Generic selection
const div = document.querySelector('div'); // Which div?

// ✅ GOOD: Specific selection
const scoreBoard = document.querySelector('#score-board');
const gameArea = document.querySelector('.game-area');
```

**Best Practices:**
- Gunakan `querySelector` untuk single element
- Gunakan `querySelectorAll` untuk multiple elements
- Gunakan specific selectors (IDs, classes, attributes)

**Students dengan issue ini:** 7/13 (54%)

---

#### 2. Event Listeners Tidak Proper

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Inline onclick
<button onclick="startGame()">Start</button>

// ❌ BAD: Direct assignment (can only have one handler)
button.onclick = handleClick;

// ✅ GOOD: addEventListener (can have multiple handlers)
button.addEventListener('click', handleClick);

// ❌ BAD: Creating new function every time
button.addEventListener('click', function() {
  score += 10;
});
button.addEventListener('click', function() {
  score += 10; // Duplicate!
});

// ✅ GOOD: Reference to function
function increaseScore() {
  score += 10;
}
button.addEventListener('click', increaseScore);

// ✅ GOOD: Remove when needed
button.addEventListener('click', increaseScore);
// Later...
button.removeEventListener('click', increaseScore);
```

**Event Delegation:**

```javascript
// ❌ BAD: Multiple listeners
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', handleCardClick);
});

// ✅ GOOD: Event delegation (better performance)
document.querySelector('.card-container').addEventListener('click', (e) => {
  if (e.target.classList.contains('card')) {
    handleCardClick(e);
  }
});
```

**Students dengan issue ini:** 8/13 (62%)

---

#### 3. Update Text/Styles Tidak Dinamis

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Not updating dynamically
const score = 100;
// Score never updates on screen!

// ✅ GOOD: Update DOM when value changes
let score = 0;
const scoreDisplay = document.querySelector('#score');

function updateScore(points) {
  score += points;
  scoreDisplay.textContent = score;
}

// ❌ BAD: Inline styles (hard to maintain)
element.style.color = 'red';
element.style.fontSize = '20px';
element.style.fontWeight = 'bold';

// ✅ GOOD: CSS classes
element.classList.add('error-state');

// CSS:
// .error-state {
//   color: red;
//   font-size: 20px;
//   font-weight: bold;
// }
```

**Students dengan issue ini:** 6/13 (46%)

---

#### 4. Visibility Elements Tidak Dihandle dengan Baik

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Inline style display
element.style.display = 'none';
element.style.display = 'block';

// ✅ GOOD: CSS class untuk visibility
element.classList.add('hidden');
element.classList.remove('hidden');

// CSS:
// .hidden { display: none; }

// ❌ BAD: Deleting and recreating elements
parent.removeChild(modal);
// Later... recreate from scratch

// ✅ GOOD: Show/hide existing element
modal.classList.add('hidden');
// Later...
modal.classList.remove('hidden');
```

**Utility Functions:**

```javascript
// Reusable show/hide functions
function show(element) {
  element.classList.remove('hidden');
}

function hide(element) {
  element.classList.add('hidden');
}

function toggle(element) {
  element.classList.toggle('hidden');
}
```

**Students dengan issue ini:** 9/13 (69%)

---

#### 5. Class Toggling Tidak Efektif

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Manual class manipulation
if (element.className.includes('active')) {
  element.className = element.className.replace('active', '');
} else {
  element.className += ' active';
}

// ✅ GOOD: Use classList API
element.classList.toggle('active');

// ❌ BAD: Multiple class operations
element.classList.remove('hidden');
element.classList.add('visible');
element.classList.add('active');

// ✅ GOOD: Multiple classes at once
element.classList.remove('hidden');
element.classList.add('visible', 'active');
```

**Advanced Usage:**

```javascript
// Check if class exists
if (element.classList.contains('active')) {
  // do something
}

// Replace class
element.classList.replace('old-class', 'new-class');

// Toggle with condition
element.classList.toggle('dark-mode', isDarkMode);
```

**Students dengan issue ini:** 10/13 (77%)

---

#### 6. innerHTML vs textContent Tidak Tepat

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Using innerHTML for text (security risk!)
element.innerHTML = userInput; // XSS vulnerability!

// ✅ GOOD: Use textContent for text
element.textContent = userInput; // Safe

// ❌ BAD: Using textContent for HTML
element.textContent = '<strong>Bold text</strong>'; // Shows as string

// ✅ GOOD: Use innerHTML for HTML (when safe)
element.innerHTML = '<strong>Bold text</strong>'; // Renders as HTML

// ✅ BETTER: Use template literals with textContent
element.textContent = `Score: ${score}`;

// ✅ BEST: Sanitize if using innerHTML with user input
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}
```

**Security Note:**
```javascript
// NEVER do this with user input:
element.innerHTML = `<div>${userInput}</div>`; // Dangerous!

// DO this instead:
const div = document.createElement('div');
div.textContent = userInput; // Safe
element.appendChild(div);
```

**Students dengan issue ini:** 5/13 (38%)

---

#### 7. Form Input Handling Tidak Benar

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Not preventing default
form.addEventListener('submit', () => {
  const value = input.value;
  // Form submits and page reloads!
});

// ✅ GOOD: Prevent default
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value;
  // Handle form data
});

// ❌ BAD: Not validating input
const userInput = input.value;
processInput(userInput); // Could be empty!

// ✅ GOOD: Validate before processing
const userInput = input.value.trim();
if (userInput === '') {
  showError('Input cannot be empty');
  return;
}
processInput(userInput);

// ❌ BAD: Not clearing input after use
// Input value stays after submission

// ✅ GOOD: Clear input after successful submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  
  if (value) {
    processInput(value);
    input.value = ''; // Clear input
    input.focus(); // Focus back for next input
  }
});
```

**Students dengan issue ini:** 7/13 (54%)

---

## 📝 Code Readability & Organization

### ✅ Criteria yang Dinilai

1. Uses meaningful variable and function names
2. Maintains proper indentation and consistent formatting
3. Avoids unnecessary repetition by reusing code effectively
4. Groups related functions together for better organization
5. Uses comments to explain complex sections of code
6. Organizes script files logically

### ❌ Common Mistakes

#### 1. Variable dan Function Names Tidak Descriptive

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Generic, unclear names
let a = 10;
let b = 5;
let x = true;
function doIt() { }
function process() { }

// ✅ GOOD: Descriptive names
let playerScore = 10;
let enemyCount = 5;
let isGameActive = true;
function startNewGame() { }
function calculateFinalScore() { }

// ❌ BAD: Inconsistent naming
let user_name = 'John';
let UserAge = 25;
let USEREMAIL = 'john@example.com';

// ✅ GOOD: Consistent camelCase
let userName = 'John';
let userAge = 25;
let userEmail = 'john@example.com';
```

**Naming Conventions:**

```javascript
// Constants: UPPER_SNAKE_CASE
const MAX_PLAYERS = 4;
const GAME_DURATION = 60;

// Variables: camelCase
let currentLevel = 1;
let playerHealth = 100;

// Functions: camelCase, verb-based
function calculateScore() { }
function updatePlayerPosition() { }
function renderGameBoard() { }

// Boolean: use is/has/can prefix
let isGameOver = false;
let hasWon = true;
let canMove = true;
```

**Students dengan issue ini:** 11/13 (85%)

---

#### 2. Indentation dan Formatting Tidak Konsisten

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Inconsistent indentation
function startGame(){
const player={
name:'John',
score:0
};
if(player.score>0){
console.log('Playing...');
}
}

// ✅ GOOD: Consistent 2-space indentation
function startGame() {
  const player = {
    name: 'John',
    score: 0
  };
  
  if (player.score > 0) {
    console.log('Playing...');
  }
}

// ❌ BAD: No spacing
let score=0;
if(score>100){score=100;}
const player={name:"John",score:score};

// ✅ GOOD: Proper spacing
let score = 0;
if (score > 100) {
  score = 100;
}
const player = { name: "John", score: score };
```

**Recommendation:** Use Prettier atau ESLint untuk auto-formatting.

**Students dengan issue ini:** 12/13 (92%)

---

#### 3. Code Repetition (Tidak DRY)

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Repetitive code
function checkWinPlayer1() {
  if (player1Score >= 100) {
    alert('Player 1 wins!');
    resetGame();
  }
}

function checkWinPlayer2() {
  if (player2Score >= 100) {
    alert('Player 2 wins!');
    resetGame();
  }
}

// ✅ GOOD: Reusable function
function checkWin(playerName, score) {
  if (score >= 100) {
    alert(`${playerName} wins!`);
    resetGame();
  }
}

checkWin('Player 1', player1Score);
checkWin('Player 2', player2Score);
```

**Students dengan issue ini:** 9/13 (69%)

---

#### 4. Functions Tidak Dikelompokkan dengan Baik

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Functions scattered randomly
function startGame() { }
function renderScore() { }
function handleClick() { }
function resetGame() { }
function updatePlayer() { }
function renderBoard() { }

// ✅ GOOD: Grouped by functionality
// === Game State Management ===
function startGame() { }
function resetGame() { }
function pauseGame() { }

// === Event Handlers ===
function handleClick() { }
function handleKeyPress() { }

// === Rendering Functions ===
function renderScore() { }
function renderBoard() { }
function renderPlayer() { }

// === Update Functions ===
function updatePlayer() { }
function updateScore() { }
```

**Students dengan issue ini:** 10/13 (77%)

---

#### 5. Comments Kurang atau Tidak Ada

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: No comments for complex logic
function calc(a, b, c) {
  return (a * b + c) / (a - c) * 100;
}

// ✅ GOOD: Comments explain WHY and complex logic
/**
 * Calculates damage reduction based on armor and defense
 * Formula: (base * armor + bonus) / (base - bonus) * 100
 * @param {number} base - Base damage
 * @param {number} armor - Armor value
 * @param {number} bonus - Defense bonus
 * @returns {number} Reduced damage percentage
 */
function calculateDamageReduction(base, armor, bonus) {
  return (base * armor + bonus) / (base - bonus) * 100;
}

// ❌ BAD: Obvious comments (comment noise)
// Increment score by 10
score = score + 10;

// ✅ GOOD: Comments explain non-obvious things
// Apply double points during bonus round
score = score + (isBonusRound ? 20 : 10);
```

**Students dengan issue ini:** 11/13 (85%)

---

#### 6. File Organization Buruk

**Masalah yang Sering Ditemukan:**

```javascript
// ❌ BAD: Everything in one file (script.js - 1000+ lines)

// ✅ GOOD: Organized file structure
// js/
//   ├── main.js          (initialization, game loop)
//   ├── player.js        (player-related functions)
//   ├── enemy.js         (enemy-related functions)
//   ├── ui.js            (UI updates, rendering)
//   ├── utils.js         (helper functions)
//   └── constants.js     (game constants)

// ❌ BAD: Inline JavaScript in HTML
<button onclick="alert('clicked')">Click</button>

// ✅ GOOD: Separate JS files
// HTML: <button id="myButton">Click</button>
// JS: document.getElementById('myButton').addEventListener('click', handleClick);
```

**Students dengan issue ini:** 8/13 (62%)

---

## 📊 Summary Statistics

### Overall Performance

| Skillset | Average Score | Common Issues |
|----------|---------------|---------------|
| JavaScript Problem-Solving | 65% | Switch statements, template literals, function structure |
| DOM Manipulation | 58% | Class toggling, event delegation, form handling |
| Code Readability | 48% | Naming, formatting, comments |

### Top 5 Most Common Issues

1. **Inconsistent formatting** (92% of students) 
2. **Poor naming conventions** (85% of students)
3. **Missing comments** (85% of students)
4. **Not using switch statements** (77% of students)
5. **Improper class toggling** (77% of students)

### Recommendations

#### For Students:
1. ✅ **Setup Prettier/ESLint** - Auto-format code
2. ✅ **Use meaningful names** - Describe what, not how
3. ✅ **Add comments** - Explain complex logic
4. ✅ **Refactor repetitive code** - Follow DRY principle
5. ✅ **Group related functions** - Better organization
6. ✅ **Learn modern JS** - Template literals, arrow functions
7. ✅ **Use classList API** - Easier class manipulation

#### For Instructors:
1. ✅ **Emphasize code organization** early
2. ✅ **Provide code style guide**
3. ✅ **Show refactoring examples**
4. ✅ **Code review sessions**
5. ✅ **Pair programming practice**

---

## 📝 Individual Student Notes

### High Performers (80%+)
- **Student**: [Name]
  - Strengths: Clean code, good naming, proper structure
  - Areas to improve: Advanced patterns, edge case handling

### Mid Performers (60-79%)
- **Student**: [Name]
  - Strengths: Basic functionality works
  - Areas to improve: Code organization, DRY principle

### Needs Improvement (<60%)
- **Student**: [Name]
  - Strengths: Effort shown
  - Areas to improve: Fundamentals, formatting, structure
  - Action: 1-on-1 session recommended

---

## 🎯 Action Items

### Immediate
- [ ] Share this review with students
- [ ] Schedule code review session
- [ ] Provide code style guide
- [ ] Share best practice examples

### Short-term
- [ ] Conduct refactoring workshop
- [ ] Implement peer code review
- [ ] Create coding challenges focused on weak areas

### Long-term
- [ ] Track improvement over time
- [ ] Update teaching materials
- [ ] Create comprehensive examples library

---

**Document Created:** [Date]  
**Reviewed By:** [Instructor Name]  
**Next Review:** [Date]
