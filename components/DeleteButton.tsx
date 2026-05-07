'use client';

export default function DeleteButton({ action, id, label = 'Eliminar' }: { action: any, id: number, label?: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="btn"
        style={{ backgroundColor: '#dc2626', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
        onClick={(e) => {
          if (!confirm(`¿${label}?`)) e.preventDefault();
        }}
      >
        {label}
      </button>
    </form>
  );
}
