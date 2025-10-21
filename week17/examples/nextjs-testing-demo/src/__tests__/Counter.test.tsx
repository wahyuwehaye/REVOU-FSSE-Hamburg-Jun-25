import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from '@/components/Counter';

describe('<Counter />', () => {
  it('menampilkan nilai awal (HTML/DOM assertion)', () => {
    render(<Counter start={3} />);
    // cek teksnya benar
    expect(screen.getByText(/Simple Counter/i)).toBeInTheDocument();
    // cek angka awal muncul di HTML
    expect(screen.getByTestId('count')).toHaveTextContent('3');
  });

  it('bertambah saat tombol +1 di klik (simulasi interaksi)', async () => {
    render(<Counter start={1} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('3');
  });

  it('reset mengembalikan nilai ke start', async () => {
    render(<Counter start={10} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /decrement/i }));
    await user.click(screen.getByRole('button', { name: /decrement/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('8');

    await user.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('10');
  });
});
