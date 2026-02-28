interface InfoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function InfoCard({ title, value, subtitle, icon }: InfoCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="mt-1.5 text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="w-9 h-9 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

