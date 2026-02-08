const EmptyState = ({ title, description }: { title: string; description?: string }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
      <div className="text-lg font-semibold">{title}</div>
      {description && <div className="mt-2 text-sm text-gray-400">{description}</div>}
    </div>
  );
};

export default EmptyState;
