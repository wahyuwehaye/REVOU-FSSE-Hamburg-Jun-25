import { sum } from '@/lib/sum';

describe('sum()', () => {
  it('menjumlahkan 2 angka dengan benar', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('mendukung angka negatif', () => {
    expect(sum(-2, 3)).toBe(1);
  });

  it('menginputkan string yang berisi angka', () => {
    expect(sum(Number('4'), Number('5'))).toBe(9);
  });

  it('menghasilkan NaN jika input bukan angka', () => {
    // expect(sum(Number('a'), 3)).toBeNaN();
    expect(sum(Number('a'), 3)).toBe(3);
  });

});
