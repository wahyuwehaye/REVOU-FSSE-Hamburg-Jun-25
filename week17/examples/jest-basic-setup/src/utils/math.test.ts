import { add, multiply, divide, subtract, percentage } from './math'

describe('Math Utilities', () => {
  // Testing add function
  describe('add', () => {
    test('adds two positive numbers', () => {
      expect(add(2, 3)).toBe(5)
    })
    
    test('adds negative numbers', () => {
      expect(add(-2, -3)).toBe(-5)
    })
    
    test('adds positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2)
    })
  })
  
  // Testing multiply function
  describe('multiply', () => {
    test('multiplies two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12)
    })
    
    test('multiplies by zero', () => {
      expect(multiply(5, 0)).toBe(0)
    })
    
    test('multiplies negative numbers', () => {
      expect(multiply(-3, -4)).toBe(12)
    })
  })
  
  // Testing divide function
  describe('divide', () => {
    test('divides two numbers', () => {
      expect(divide(10, 2)).toBe(5)
    })
    
    test('handles division by zero', () => {
      expect(divide(10, 0)).toBe(Infinity)
    })
    
    test('divides with decimals', () => {
      expect(divide(10, 3)).toBeCloseTo(3.333, 2)
    })
  })
  
  // Testing subtract function
  describe('subtract', () => {
    test('subtracts two numbers', () => {
      expect(subtract(10, 3)).toBe(7)
    })
    
    test('subtracts negative numbers', () => {
      expect(subtract(-5, -3)).toBe(-2)
    })
  })
  
  // Testing percentage function
  describe('percentage', () => {
    test('calculates percentage correctly', () => {
      expect(percentage(25, 100)).toBe(25)
    })
    
    test('handles zero total', () => {
      expect(percentage(10, 0)).toBe(0)
    })
    
    test('calculates decimal percentages', () => {
      expect(percentage(1, 3)).toBeCloseTo(33.33, 2)
    })
  })
})
