import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('LoginForm', () => {
  const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
  const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);
  });

  it('renders login form with default values', () => {
    render(<LoginForm />);
    
    expect(screen.getByRole('heading', { name: /masuk ke akun/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveValue('admin@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('admin123');
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
  });

  it('displays demo credentials information', () => {
    render(<LoginForm />);
    
    expect(screen.getByText(/demo user:/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@example.com \/ admin123/i)).toBeInTheDocument();
    expect(screen.getByText(/user@example.com \/ user123/i)).toBeInTheDocument();
  });

  it('allows user to change email and password', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.clear(emailInput);
    await user.type(emailInput, 'test@example.com');
    
    await user.clear(passwordInput);
    await user.type(passwordInput, 'test123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('test123');
  });

  it('successfully logs in with valid credentials', async () => {
    const user = userEvent.setup();
    const assignMock = jest.fn();
    delete (window as any).location;
    window.location = { href: '', assign: assignMock } as any;
    
    mockSignIn.mockResolvedValue({
      ok: true,
      error: null,
      status: 200,
      url: '/dashboard',
    } as any);
    
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /masuk/i });
    await user.click(submitButton);
    
    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'admin@example.com',
      password: 'admin123',
      redirect: false,
      callbackUrl: '/dashboard',
    });
  });

  it('displays error message on failed login', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({
      ok: false,
      error: 'CredentialsSignin',
      status: 401,
      url: null,
    } as any);
    
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /masuk/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email atau password salah/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();
    mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /masuk/i });
    await user.click(submitButton);
    
    expect(screen.getByRole('button', { name: /sedang masuk\.\.\./i })).toBeDisabled();
  });

  it('redirects to custom callback URL from search params', async () => {
    const user = userEvent.setup();
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('/admin'),
    } as any);
    
    mockSignIn.mockResolvedValue({
      ok: true,
      error: null,
      status: 200,
      url: '/admin',
    } as any);
    
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /masuk/i });
    await user.click(submitButton);
    
    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'admin@example.com',
      password: 'admin123',
      redirect: false,
      callbackUrl: '/admin',
    });
  });

  it('clears previous error when submitting again', async () => {
    const user = userEvent.setup();
    
    // First attempt - fails
    mockSignIn.mockResolvedValueOnce({
      ok: false,
      error: 'CredentialsSignin',
      status: 401,
      url: null,
    } as any);
    
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /masuk/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email atau password salah/i)).toBeInTheDocument();
    });
    
    // Second attempt - succeeds
    mockSignIn.mockResolvedValueOnce({
      ok: true,
      error: null,
      status: 200,
      url: '/dashboard',
    } as any);
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/email atau password salah/i)).not.toBeInTheDocument();
    });
  });

  it('validates email format is required', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toBeRequired();
  });

  it('validates password is required', () => {
    render(<LoginForm />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toBeRequired();
  });
});
