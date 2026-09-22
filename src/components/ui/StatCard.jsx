export default function StatCard({ icon, label, value, color = 'primary', subtitle }) {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-amber-500',
    purple: 'from-purple-500 to-fuchsia-500',
  };

  return (
    <div className="card card-hover">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white text-2xl shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
