export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'white' }}>
      {children}
    </div>
  );
}
