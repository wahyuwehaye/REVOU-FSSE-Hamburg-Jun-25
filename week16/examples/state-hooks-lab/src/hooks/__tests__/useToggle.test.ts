import { renderHook, act } from '@testing-library/react';
import { useToggle } from '../useToggle';

describe('useToggle', () => {
  it('initializes with default value false', () => {
    const { result } = renderHook(() => useToggle());
    
    expect(result.current.value).toBe(false);
  });

  it('initializes with custom default value', () => {
    const { result } = renderHook(() => useToggle(true));
    
    expect(result.current.value).toBe(true);
  });

  it('toggles value when toggle is called', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.value).toBe(true);
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.value).toBe(false);
  });

  it('sets value to true when setTrue is called', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current.setTrue();
    });
    
    expect(result.current.value).toBe(true);
    
    // Calling setTrue again should keep it true
    act(() => {
      result.current.setTrue();
    });
    
    expect(result.current.value).toBe(true);
  });

  it('sets value to false when setFalse is called', () => {
    const { result } = renderHook(() => useToggle(true));
    
    act(() => {
      result.current.setFalse();
    });
    
    expect(result.current.value).toBe(false);
    
    // Calling setFalse again should keep it false
    act(() => {
      result.current.setFalse();
    });
    
    expect(result.current.value).toBe(false);
  });

  it('provides stable function references', () => {
    const { result, rerender } = renderHook(() => useToggle());
    
    const firstToggle = result.current.toggle;
    const firstSetTrue = result.current.setTrue;
    const firstSetFalse = result.current.setFalse;
    
    rerender();
    
    expect(result.current.toggle).toBe(firstToggle);
    expect(result.current.setTrue).toBe(firstSetTrue);
    expect(result.current.setFalse).toBe(firstSetFalse);
  });

  it('allows multiple toggles in sequence', () => {
    const { result } = renderHook(() => useToggle(false));
    
    expect(result.current.value).toBe(false);
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(false);
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);
  });

  it('can be set to true and then toggled', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current.setTrue();
    });
    expect(result.current.value).toBe(true);
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(false);
  });

  it('can be set to false and then toggled', () => {
    const { result } = renderHook(() => useToggle(true));
    
    act(() => {
      result.current.setFalse();
    });
    expect(result.current.value).toBe(false);
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);
  });
});
