import React from "react";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

const StatCard: React.FC<Props> = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
      <div className="text-xs text-gray-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {subtitle && <div className="mt-2 text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

export default StatCard;