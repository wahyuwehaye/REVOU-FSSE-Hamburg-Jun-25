import ProductSkeleton from './ProductSkeleton.jsx';

export default function ProductSkeletonGrid() {
  return (
    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}
