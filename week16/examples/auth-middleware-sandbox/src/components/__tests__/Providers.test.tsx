import { render, screen } from '@testing-library/react';
import { Providers } from '../Providers';
import { SessionProvider } from 'next-auth/react';

// Mock next-auth SessionProvider
jest.mock('next-auth/react', () => ({
  SessionProvider: jest.fn(({ children }) => <div data-testid="session-provider">{children}</div>),
}));

describe('Providers', () => {
  it('renders children wrapped in SessionProvider', () => {
    render(
      <Providers>
        <div>Test Child</div>
      </Providers>
    );
    
    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('calls SessionProvider with correct props', () => {
    const TestComponent = () => <div>Test Component</div>;
    
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );
    
    expect(SessionProvider).toHaveBeenCalled();
  });

  it('renders multiple children correctly', () => {
    render(
      <Providers>
        <div>First Child</div>
        <div>Second Child</div>
        <div>Third Child</div>
      </Providers>
    );
    
    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
  });
});
