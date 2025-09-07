

### 🔧 **SKILLSET 1: JAVASCRIPT PROBLEM-SOLVING**

#### ❌ **Common Mistake 1: Comparison Operators**

**Masalah:** Banyak yang masih menggunakan `==` instead of `===`

**Contoh yang ditemukan:**
```javascript
// ❌ SALAH - Bisa menyebabkan bug
if (player == computer) {
    result = "Tie";
}

// ✅ BENAR - Lebih aman dan konsisten
if (player === computer) {
    result = "Tie";
}
```

**Mengapa penting?**
- `==` melakukan type coercion yang bisa menyebabkan unexpected behavior
- `===` lebih strict dan predictable
- Best practice untuk JavaScript modern

**Contoh perbaikan:**
```javascript
// Sebelum
if (score == 0) { /* ... */ }

// Sesudah
if (score === 0) { /* ... */ }
```

#### ❌ **Common Mistake 2: String Concatenation**

**Masalah:** Masih pakai `+` instead of template literals

**Contoh yang ditemukan:**
```javascript
// ❌ SALAH - Sulit dibaca dan maintain
result.textContent = "You Win! " + playerChoice + " beats " + computerChoice + ".";

// ✅ BENAR - Lebih clean dan readable
result.textContent = `You Win! ${playerChoice} beats ${computerChoice}.`;
```

**Mengapa template literals lebih baik?**
- Lebih mudah dibaca
- Support multi-line strings
- Lebih aman dari injection attacks
- Lebih mudah maintain

**Contoh perbaikan:**
```javascript
// Sebelum
let message = "Score: " + score + " | Time: " + timeLeft;

// Sesudah
let message = `Score: ${score} | Time: ${timeLeft}`;
```

---

### 🎯 **SKILLSET 2: DOM MANIPULATION & EVENT HANDLING**

#### ❌ **Common Mistake 1: Missing Null Checks**

**Masalah:** Tidak check apakah element exists sebelum digunakan

**Contoh yang ditemukan:**
```javascript
// ❌ SALAH - Bisa menyebabkan error
const scoreElement = document.getElementById('score');
scoreElement.textContent = score; // Error jika element tidak ada

// ✅ BENAR - Aman dan robust
const scoreElement = document.getElementById('score');
if (scoreElement) {
    scoreElement.textContent = score;
} else {
    console.error('Score element not found');
}
```

**Mengapa penting?**
- Mencegah JavaScript errors yang bisa crash aplikasi
- Memberikan feedback yang jelas ketika ada masalah
- Membuat aplikasi lebih robust

**Contoh perbaikan:**
```javascript
// Sebelum
document.getElementById('result').textContent = result;

// Sesudah
const resultElement = document.getElementById('result');
if (resultElement) {
    resultElement.textContent = result;
}
```

#### ❌ **Common Mistake 2: Direct Style Manipulation**

**Masalah:** Masih pakai direct style manipulation instead of class toggling

**Contoh yang ditemukan:**
```javascript
// ❌ SALAH - Sulit maintain dan tidak scalable
element.style.display = 'none';
element.style.backgroundColor = 'red';
element.style.color = 'white';

// ✅ BENAR - Lebih maintainable
element.classList.add('hidden');
element.classList.add('error-state');
```

**Mengapa class toggling lebih baik?**
- Separation of concerns (CSS untuk styling, JS untuk logic)
- Lebih mudah maintain dan update
- Lebih performant
- Lebih scalable

**Contoh perbaikan:**
```javascript
// Sebelum
if (gameOver) {
    button.style.display = 'none';
    button.style.backgroundColor = 'gray';
}

// Sesudah
if (gameOver) {
    button.classList.add('game-over');
}
```

---

### �� **SKILLSET 3: CODE READABILITY & ORGANIZATION**

#### ❌ **Common Mistake 1: Lack of Comments**

**Masalah:** Banyak yang memberi sedikit komentar bahkan tidak sama sekali

**Contoh yang ditemukan:**
```javascript
// ❌ SALAH - Sulit dipahami
function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    updateScore(result);
    checkGameOver();
}

// ✅ BENAR - Jelas dan mudah dipahami
function playRound(playerChoice) {
    // Get computer's random choice
    const computerChoice = getComputerChoice();
    
    // Determine who wins this round
    const result = determineWinner(playerChoice, computerChoice);
    
    // Update score display
    updateScore(result);
    
    // Check if game should end
    checkGameOver();
}
```

**Mengapa comments penting?**
- Membantu memahami logic yang complex
- Memudahkan debugging dan maintenance
- Membantu team members memahami code
- Dokumentasi untuk future reference

**Contoh perbaikan:**
```javascript
// Sebelum
let score = 0;
if (score >= 5) { /* ... */ }

// Sesudah
let score = 0;
// Check if player reached winning score
if (score >= 5) { /* ... */ }
```

#### ❌ **Common Mistake 2: Poor Variable Naming**

**Masalah:** Nama variabel tidak deskriptif

**Contoh yang ditemukan:**
```javascript
// ❌ SALAH - Tidak jelas apa fungsinya
let a = 0;
let b = 0;
let temp = '';

// ✅ BENAR - Jelas dan descriptive
let playerScore = 0;
let computerScore = 0;
let currentResult = '';
```

**Mengapa naming penting?**
- Code menjadi self-documenting
- Lebih mudah dipahami tanpa perlu membaca logic
- Mengurangi need untuk comments
- Memudahkan debugging

**Contoh perbaikan:**
```javascript
// Sebelum
let x = Math.floor(Math.random() * 3);
let y = choices[x];

// Sesudah
let randomIndex = Math.floor(Math.random() * 3);
let computerChoice = choices[randomIndex];
```

---

## �� **NEXT STEPS & RECOMMENDATIONS**

### **Priority 1 - Fix Immediately:**
1. **Ganti semua `==` dengan `===`**
2. **Gunakan template literals untuk string concatenation**
3. **Tambahkan null checks untuk semua DOM operations**
4. **Gunakan class toggling instead of direct style manipulation**

### **Priority 2 - Improve Soon:**
1. **Tambahkan comments untuk complex logic**
2. **Ganti nama variabel yang tidak deskriptif**
3. **Implementasi proper error handling**
4. **Gunakan switch statements untuk multiple conditions**

### **Priority 3 - Nice to Have:**
1. **Organize code ke dalam separate files**
2. **Buat utility functions untuk repeated code**
3. **Implementasi proper module pattern**
4. **Tambahkan input validation**
