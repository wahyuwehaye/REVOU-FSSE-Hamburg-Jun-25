import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '@/context/ThemeContext';

describe('ThemeToggle', () => {
  it('renders toggle button with light theme text', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    expect(screen.getByRole('button', { name: /mode gelap/i })).toBeInTheDocument();
  });

  it('toggles to dark theme when clicked', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/mode gelap/i);
    
    await user.click(button);
    
    expect(screen.getByRole('button', { name: /mode terang/i })).toBeInTheDocument();
  });

  it('toggles back to light theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button');
    
    // Toggle to dark
    await user.click(button);
    expect(button).toHaveTextContent(/mode terang/i);
    
    // Toggle back to light
    await user.click(button);
    expect(button).toHaveTextContent(/mode gelap/i);
  });

  it('applies correct styles for light theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      background: 'rgb(17, 24, 39)',
      color: 'rgb(255, 255, 255)',
    });
  });

  it('applies correct styles for dark theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(button).toHaveStyle({
      background: 'rgb(226, 232, 240)',
      color: 'rgb(17, 24, 39)',
    });
  });

  it('allows multiple toggles', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button');
    
    expect(button).toHaveTextContent(/mode gelap/i);
    
    await user.click(button);
    expect(button).toHaveTextContent(/mode terang/i);
    
    await user.click(button);
    expect(button).toHaveTextContent(/mode gelap/i);
    
    await user.click(button);
    expect(button).toHaveTextContent(/mode terang/i);
  });
});
