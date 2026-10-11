export default function Loader({ text = "Cargando..." }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-utec-primary" />
      <span className="ml-3 text-slate-600">{text}</span>
    </div>
  );
}