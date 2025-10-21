# 01 - Introduction to Testing in Web Development

## 🎯 Tujuan Pembelajaran

Setelah mempelajari modul ini, Anda akan mampu:
- Memahami pentingnya testing dalam web development
- Mengenal berbagai jenis testing
- Memahami kapan dan mengapa menggunakan testing
- Mengenal tools testing yang populer

## 📚 Pentingnya Testing dalam Web Development

### Apa itu Testing?

Testing adalah proses memverifikasi bahwa aplikasi web Anda bekerja dengan benar, reliabel, dan mempertahankan kualitasnya dari waktu ke waktu.

**Analogi Sederhana:**
Bayangkan Anda membuka restoran. Sebelum melayani pelanggan, Anda akan:
- Mencicipi setiap masakan (unit testing)
- Memastikan pesanan sampai dengan benar dari dapur ke meja (integration testing)
- Mengamati pengalaman lengkap pelanggan dari masuk hingga keluar (E2E testing)

Testing dalam web development bekerja dengan cara yang sama!

### Mengapa Testing Itu Penting?

#### 1. **Menangkap Bug Lebih Awal** 🐛
```
Tanpa Testing:
Develop → Deploy → User menemukan bug → Komplain → Fix → Deploy ulang
Waktu: Lama, Biaya: Mahal, Reputasi: Rusak

Dengan Testing:
Develop → Test → Temukan bug → Fix → Test lagi → Deploy
Waktu: Cepat, Biaya: Murah, Reputasi: Terjaga
```

#### 2. **Mempertahankan Kualitas Kode** 💎
- Saat menambah fitur baru, testing memastikan fitur lama tidak rusak
- Memudahkan refactoring tanpa takut merusak sesuatu
- Code review menjadi lebih mudah

#### 3. **Meningkatkan User Experience** 😊
- User mengalami lebih sedikit masalah
- Aplikasi lebih stabil dan reliable
- Kepercayaan user meningkat

#### 4. **Dokumentasi Hidup** 📖
- Test cases menjelaskan cara kerja kode
- Developer baru lebih mudah memahami codebase
- Requirement bisnis tercatat dalam test

#### 5. **Confidence saat Deploy** 🚀
- Tidak deg-degan saat deploy ke production
- Rollback lebih jarang terjadi
- Sleep better at night! 😴

## 🔍 Jenis-Jenis Testing

### 1. Unit Testing

**Definisi:** Testing komponen atau fungsi individual secara terpisah.

**Contoh:**
```typescript
// Function yang akan ditest
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// Unit test
test('calculateTotal harus mengalikan harga dengan kuantitas', () => {
  expect(calculateTotal(100, 3)).toBe(300);
  expect(calculateTotal(50, 2)).toBe(100);
});
```

**Kapan digunakan:**
- Testing logic bisnis
- Testing utility functions
- Testing individual React components

**Karakteristik:**
- ⚡ Cepat dijalankan
- 🎯 Focus pada satu unit kecil
- 🔄 Mudah di-maintain
- 📊 Coverage yang tinggi

### 2. Integration Testing

**Definisi:** Testing bagaimana berbagai bagian aplikasi bekerja bersama.

**Contoh:**
```typescript
// Integration test: Form + API
test('submit form harus mengirim data ke API', async () => {
  render(<LoginForm />);
  
  // User mengisi form
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'user@example.com' }
  });
  
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123' }
  });
  
  // User submit
  fireEvent.click(screen.getByText('Login'));
  
  // Verifikasi API dipanggil dengan data yang benar
  await waitFor(() => {
    expect(mockApiCall).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123'
    });
  });
});
```

**Kapan digunakan:**
- Testing interaksi antar components
- Testing form submission dengan API
- Testing authentication flow

### 3. End-to-End (E2E) Testing

**Definisi:** Testing workflow lengkap dari perspektif user.

**Contoh Skenario:**
```
1. User membuka website
2. User login dengan credentials
3. User browse produk
4. User menambahkan produk ke cart
5. User melakukan checkout
6. User menerima konfirmasi order
```

**Tools populer:**
- Cypress
- Playwright
- Selenium

**Kapan digunakan:**
- Testing critical user journeys
- Testing sebelum production release
- Regression testing

### 4. User Interface (UI) Testing

**Definisi:** Testing elemen visual dan interaksi user.

**Contoh:**
```typescript
test('button harus ter-disable saat loading', () => {
  render(<SubmitButton loading={true} />);
  
  const button = screen.getByRole('button');
  
  expect(button).toBeDisabled();
  expect(button).toHaveTextContent('Loading...');
});
```

## 📊 Testing Pyramid

```
        /\
       /  \
      / E2E \         <- Sedikit, Lambat, Mahal
     /______\
    /        \
   /Integration\      <- Sedang
  /____________\
 /              \
/   Unit Tests   \    <- Banyak, Cepat, Murah
/__________________\
```

**Best Practice:**
- **70%** Unit Tests - Banyak, cepat, test logic detail
- **20%** Integration Tests - Test interaksi antar bagian
- **10%** E2E Tests - Test critical user flows

## 🎨 Testing Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad:**
```typescript
test('counter harus memiliki state bernama count', () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current.count).toBeDefined();
});
```

✅ **Good:**
```typescript
test('counter harus increment saat tombol diklik', () => {
  render(<Counter />);
  
  const button = screen.getByText('Increment');
  fireEvent.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 2. Keep Tests Simple and Focused

❌ **Bad:**
```typescript
test('login flow lengkap', () => {
  // Testing terlalu banyak hal sekaligus
  // render, input, validation, API call, redirect, dll
});
```

✅ **Good:**
```typescript
test('form harus menampilkan error saat email invalid', () => {
  // Focus pada satu behavior
});

test('form harus call API dengan data yang benar', () => {
  // Focus pada behavior lain
});
```

### 3. Use Descriptive Test Names

❌ **Bad:**
```typescript
test('test 1', () => { ... });
test('works', () => { ... });
```

✅ **Good:**
```typescript
test('should display error message when email is invalid', () => { ... });
test('should disable submit button while form is submitting', () => { ... });
```

### 4. Arrange-Act-Assert (AAA) Pattern

```typescript
test('counter increment works correctly', () => {
  // ARRANGE - Setup
  render(<Counter initialValue={0} />);
  
  // ACT - Lakukan aksi
  const button = screen.getByText('Increment');
  fireEvent.click(button);
  
  // ASSERT - Verifikasi hasil
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## 🤔 Kapan Tidak Perlu Testing?

Meskipun testing penting, ada beberapa situasi di mana testing mungkin tidak cost-effective:

1. **Prototype atau POC** - Untuk validasi ide cepat
2. **Code yang sangat simple** - getter/setter sederhana
3. **Third-party library** - Sudah ditest oleh maintainer
4. **UI yang sering berubah** - Saat masih dalam tahap design exploration

## 💡 Key Takeaways

1. ✅ Testing menangkap bug lebih awal dan menghemat biaya
2. ✅ Ada berbagai jenis testing untuk berbagai kebutuhan
3. ✅ Unit testing harus menjadi fondasi testing strategy
4. ✅ Test behavior, bukan implementation details
5. ✅ Good tests adalah dokumentasi yang hidup
6. ✅ Testing memberikan confidence saat melakukan changes

## 🎯 Exercise

Pikirkan tentang aplikasi yang sedang Anda kerjakan:

1. Identifikasi 3 fitur critical yang harus memiliki test
2. Untuk setiap fitur, tuliskan:
   - Apa yang harus ditest? (behavior)
   - Jenis testing apa yang sesuai? (unit/integration/E2E)
   - Apa expected outcome-nya?

**Contoh:**

| Fitur | Yang Ditest | Jenis Test | Expected Outcome |
|-------|-------------|------------|------------------|
| Login Form | Form validation | Unit | Error message muncul untuk invalid email |
| Add to Cart | Product ditambahkan | Integration | Cart count bertambah dan product muncul di cart |
| Checkout Flow | Complete purchase | E2E | Order confirmation page ditampilkan |

## 📚 Resources

- [Testing JavaScript by Kent C. Dodds](https://testingjavascript.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/testing-implementation-details)
- [The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

---

**Next:** [02 - Overview of Jest and React Testing Library](./02-jest-and-rtl-overview.md)
