const colorMap = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  pink: 'bg-pink-100 text-pink-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  teal: 'bg-teal-100 text-teal-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
};

const colors = Object.keys(colorMap);

function getColor(skill) {
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = skill.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function SkillBadge({ skill, type = 'teach', size = 'md', className = '' }) {
  const color = colorMap[getColor(skill)];
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  const typeIndicator =
    type === 'teach' ? '🌱' : type === 'learn' ? '🎯' : '';

  return (
    <span className={`badge ${color} ${sizes[size]} ${className}`}>
      {typeIndicator} {skill}
    </span>
  );
}
