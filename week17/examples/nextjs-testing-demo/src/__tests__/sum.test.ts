import { sum } from '@/lib/sum';

describe('sum()', () => {
  it('menjumlahkan 2 angka dengan benar', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('mendukung angka negatif', () => {
    expect(sum(-2, 3)).toBe(1);
  });
});
