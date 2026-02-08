import React from "react";

type Variant = "success" | "warning" | "danger" | "neutral";

const styles: Record<Variant, string> = {
  success: "bg-green-500/15 text-green-300 border-green-400/20",
  warning: "bg-yellow-500/15 text-yellow-300 border-yellow-400/20",
  danger: "bg-red-500/15 text-red-300 border-red-400/20",
  neutral: "bg-white/10 text-gray-200 border-white/10",
};

const Badge: React.FC<{ children: React.ReactNode; variant?: Variant }> = ({
  children,
  variant = "neutral",
}) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full border ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;