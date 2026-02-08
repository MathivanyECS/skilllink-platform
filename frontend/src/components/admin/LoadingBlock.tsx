const LoadingBlock = ({ label = "Loading..." }: { label?: string }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm text-gray-300">{label}</div>
      <div className="mt-4 h-2 w-full rounded bg-white/10 overflow-hidden">
        <div className="h-2 w-1/3 bg-green-500/40 animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingBlock;
