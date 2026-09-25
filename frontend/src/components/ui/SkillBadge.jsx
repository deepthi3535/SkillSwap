const colorMap = {
  blue: 'bg-blue-100/80 text-blue-700 hover:bg-blue-200/80',
  green: 'bg-green-100/80 text-green-700 hover:bg-green-200/80',
  purple: 'bg-purple-100/80 text-purple-700 hover:bg-purple-200/80',
  orange: 'bg-orange-100/80 text-orange-700 hover:bg-orange-200/80',
  pink: 'bg-pink-100/80 text-pink-700 hover:bg-pink-200/80',
  cyan: 'bg-cyan-100/80 text-cyan-700 hover:bg-cyan-200/80',
  indigo: 'bg-indigo-100/80 text-indigo-700 hover:bg-indigo-200/80',
  teal: 'bg-teal-100/80 text-teal-700 hover:bg-teal-200/80',
  amber: 'bg-amber-100/80 text-amber-700 hover:bg-amber-200/80',
  red: 'bg-red-100/80 text-red-700 hover:bg-red-200/80',
};

const colors = Object.keys(colorMap);

function getColor(skill) {
  const str = typeof skill === 'string' ? skill : String(skill || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function SkillBadge({ skill, type = 'teach', size = 'md', className = '' }) {
  const label = typeof skill === 'string' ? skill : (skill?.name || String(skill || ''));
  const color = colorMap[getColor(label)] || colorMap.blue;
  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  const typeIndicator =
    type === 'teach' ? '🌱' : type === 'learn' ? '🎯' : '';

  return (
    <span className={`badge ${color} ${sizes[size]} ${className} hover:scale-105 cursor-default`}>
      {typeIndicator} {skill}
    </span>
  );
}
