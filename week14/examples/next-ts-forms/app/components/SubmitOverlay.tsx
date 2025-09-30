type SubmitOverlayProps = {
  visible: boolean;
  message?: string;
};

export function SubmitOverlay({ visible, message = 'Mengirim data...' }: SubmitOverlayProps) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        display: 'grid',
        placeItems: 'center',
        backdropFilter: 'blur(4px)',
        color: 'white',
        zIndex: 40,
      }}
    >
      <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
        <span className="spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
}
