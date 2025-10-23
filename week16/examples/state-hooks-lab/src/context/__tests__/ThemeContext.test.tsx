import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Test component that uses useTheme
function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

describe('ThemeContext', () => {
  it('provides default theme as light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('toggles theme from light to dark', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('toggles theme from dark back to light', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Toggle to dark
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    
    // Toggle back to light
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('allows multiple toggles', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    await user.click(button);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    
    await user.click(button);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    await user.click(button);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('updates document.documentElement.dataset.theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initially light
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(document.documentElement.dataset.theme).toBe('light');
    
    // Toggle to dark
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    
    // Toggle back to light
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    function ComponentWithoutProvider() {
      useTheme(); // This should throw
      return null;
    }
    
    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('useTheme harus dipakai di dalam ThemeProvider');
    
    consoleError.mockRestore();
  });

  it('shares theme state across multiple consumers', async () => {
    const user = userEvent.setup();
    
    function Consumer1() {
      const { theme } = useTheme();
      return <div data-testid="consumer1">{theme}</div>;
    }
    
    function Consumer2() {
      const { theme, toggleTheme } = useTheme();
      return (
        <div>
          <div data-testid="consumer2">{theme}</div>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      );
    }
    
    render(
      <ThemeProvider>
        <Consumer1 />
        <Consumer2 />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('consumer1')).toHaveTextContent('light');
    expect(screen.getByTestId('consumer2')).toHaveTextContent('light');
    
    await user.click(screen.getByRole('button', { name: /toggle/i }));
    
    expect(screen.getByTestId('consumer1')).toHaveTextContent('dark');
    expect(screen.getByTestId('consumer2')).toHaveTextContent('dark');
  });
});
