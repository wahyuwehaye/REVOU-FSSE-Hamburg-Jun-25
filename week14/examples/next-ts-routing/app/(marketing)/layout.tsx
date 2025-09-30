type MarketingLayoutProps = {
  children: React.ReactNode;
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return <main style={{ background: 'rgba(15, 23, 42, 0.3)', borderRadius: '1.5rem', padding: '2rem' }}>{children}</main>;
}
