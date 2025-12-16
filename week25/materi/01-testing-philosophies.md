# Testing Philosophies - Filosofi Testing

## 🤔 Apa itu Testing Philosophy?

**Analogi Sederhana:**
Bayangkan kamu buka warung makan. Testing philosophy itu seperti:
- **Manual tasting** = Kamu cicip sendiri setiap masakan sebelum kasih ke customer
- **Customer feedback** = Tunggu customer bilang "enak" atau "kurang asin"
- **Lab testing** = Cek tiap bahan mentah sebelum masak

Testing philosophy adalah **cara pandang kita** tentang testing: kapan test, apa yang di-test, dan seberapa penting testing dalam development cycle.

---

## 🎯 Tiga Filosofi Testing Utama

### 1. Test-Driven Development (TDD) 🚦
**Konsep:** "Write tests FIRST, then write code to pass those tests"

**Analogi:** Seperti bikin blueprint rumah dulu sebelum bangun rumah.

**Flow TDD:**
```
1. RED 🔴   - Tulis test dulu (pasti gagal, karena belum ada code)
2. GREEN ✅  - Tulis code minimal sampai test pass
3. REFACTOR ♻️ - Perbaiki code tanpa ubah behavior
4. REPEAT 🔁
```

**Contoh Real:**
```typescript
// STEP 1: RED - Tulis test dulu
describe('Calculator', () => {
  it('should add two numbers', () => {
    const calculator = new Calculator();
    expect(calculator.add(2, 3)).toBe(5); // ❌ Test fails (Calculator belum ada)
  });
});

// STEP 2: GREEN - Buat code minimal
class Calculator {
  add(a: number, b: number): number {
    return a + b; // ✅ Test pass
  }
}

// STEP 3: REFACTOR - Improve code (if needed)
class Calculator {
  // Code sudah simple, no refactor needed
  add(a: number, b: number): number {
    return a + b;
  }
}
```

**Kapan pakai TDD?**
- ✅ Business logic yang kompleks
- ✅ Butuh confidence tinggi
- ✅ API atau library yang akan di-consume banyak orang
- ❌ Prototype cepat atau POC (Proof of Concept)

---

### 2. Behavior-Driven Development (BDD) 🎭
**Konsep:** "Focus on BEHAVIOR, not implementation"

**Analogi:** Seperti kasih instruksi ke tukang: "Bikin ruang tamu yang nyaman untuk 10 orang" bukan "Pasang 3 sofa ukuran 2x1 meter".

**BDD menggunakan bahasa natural:**
```typescript
// BDD Style - Readable by non-developers
describe('User Login Feature', () => {
  describe('GIVEN a registered user', () => {
    describe('WHEN they provide correct credentials', () => {
      it('THEN they should be logged in successfully', () => {
        // Test implementation
      });
    });

    describe('WHEN they provide wrong password', () => {
      it('THEN they should see an error message', () => {
        // Test implementation
      });
    });
  });
});
```

**BDD Keywords:**
- **GIVEN** = Initial state/context (Kondisi awal)
- **WHEN** = Action/event (Aksi yang dilakukan)
- **THEN** = Expected outcome (Hasil yang diharapkan)

**Kapan pakai BDD?**
- ✅ Kolaborasi dengan Product Manager/Business Analyst
- ✅ Feature yang butuh dokumentasi jelas
- ✅ Integration/E2E testing

---

### 3. Test After Development (TAD) 🏗️
**Konsep:** "Build first, test later"

**Analogi:** Kayak bikin masakan dulu, baru cicip di akhir.

**Flow TAD:**
```
1. Tulis code dulu ⚡
2. Feature selesai 🎉
3. Baru tulis tests 📝
4. Fix bugs yang ketemu ❌→✅
```

**Kelebihan:**
- ⚡ Development lebih cepat (untuk prototype)
- 🎨 Lebih fleksibel untuk eksperimen
- 🚀 Good for startup/MVP

**Kekurangan:**
- 🐛 Bugs baru ketauan di akhir
- 🔄 Refactor jadi sulit (karena no safety net)
- 😰 "Nanti aja" syndrome → tests never written

**Kapan pakai TAD?**
- ✅ Prototyping atau MVP
- ✅ Eksperimen fitur baru
- ✅ Deadline ketat (tapi bahaya!)
- ❌ Production-critical system

---

## 🧪 Testing Pyramid

```
        /\
       /E2E\         ← Few (Slow, expensive, fragile)
      /------\
     /  INTEG \      ← Some (Medium speed, medium cost)
    /----------\
   /    UNIT    \    ← Many (Fast, cheap, reliable)
  /--------------\
```

**Unit Tests (70%)** 🟢
- Test individual functions/methods
- Fast (milliseconds)
- Isolated (no database, no network)
- Example: Test `calculateDiscount()` function

**Integration Tests (20%)** 🟡
- Test multiple components working together
- Medium speed (seconds)
- Example: Test service + repository + database

**E2E Tests (10%)** 🔴
- Test complete user flows
- Slow (minutes)
- Example: User login → browse products → checkout

---

## 💡 Best Practices

### ✅ DO:
1. **Write tests for critical paths** (login, payment, data integrity)
2. **Keep tests simple and readable**
3. **Test one thing at a time**
4. **Use descriptive test names**
   ```typescript
   ✅ it('should return 404 when user not found')
   ❌ it('test1')
   ```
5. **Mock external dependencies** (database, API, file system)

### ❌ DON'T:
1. **Test framework code** (don't test NestJS internals)
2. **Test getters/setters** (waste of time)
3. **Write flaky tests** (tests that randomly fail)
4. **Over-mock** (mocking everything = not testing anything)
5. **Ignore failing tests** (fix or delete, don't skip!)

---

## 🎯 Choosing the Right Philosophy

**Untuk Backend NestJS:**

| Scenario | Philosophy | Reason |
|----------|-----------|--------|
| Business logic (calculations, rules) | TDD 🚦 | High confidence needed |
| API endpoints (REST/GraphQL) | BDD 🎭 | Clear behavior specification |
| Quick prototype/POC | TAD 🏗️ | Speed over perfection |
| Refactoring legacy code | TDD 🚦 | Safety net for changes |
| Bug fixing | TDD 🚦 | Write test that fails, then fix |

---

## 🧠 Philosophy Behind "Why I Also Suck at Testing"

**Realita pahit:**
- 😅 Writing tests feels slower than writing features
- 🤔 "What should I test?" is not always obvious
- 😰 Mocking is confusing at first
- ⏰ Deadline pressure = skip tests

**Truth bomb:**
- 🐛 Bugs cost MORE time to fix than writing tests
- 💸 Production bugs cost MONEY and REPUTATION
- 😌 Tests give you CONFIDENCE to refactor
- 🚀 Tests make you FASTER in the long run

**Testing is a skill:**
- Like belajar naik motor: awkward at first, natural later
- Practice makes perfect
- Start small, build habits

---

## 📝 Summary

| Philosophy | When to Write Tests | Best For | Speed |
|-----------|-------------------|----------|-------|
| **TDD** 🚦 | BEFORE code | Critical business logic | 🐢 Slow |
| **BDD** 🎭 | WITH code | User-facing features | 🐰 Medium |
| **TAD** 🏗️ | AFTER code | Prototypes/MVP | 🚀 Fast |

**Key Takeaway:**
> "The best testing philosophy is the one that makes you **ACTUALLY WRITE TESTS**. Start with any approach, then improve over time."

---

## 🔗 Next Steps
- **Materi 02:** Testabilities - Apa yang membuat code mudah di-test
- **Materi 03:** Testing Fundamentals - Unit test dasar dengan Jest
