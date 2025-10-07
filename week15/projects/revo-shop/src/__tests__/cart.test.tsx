import { render, screen } from "@testing-library/react";
import CartButton from "@/components/CartButton";
import { useCartStore } from "@/stores/useCartStore";

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

describe("CartButton", () => {
  it("menampilkan jumlah item", () => {
    const { addItem } = useCartStore.getState();
    addItem({ id: 1, title: "Demo", price: 10000 });
    render(<CartButton />);
    expect(screen.getByText(/Cart \(1\)/i)).toBeInTheDocument();
  });
});
