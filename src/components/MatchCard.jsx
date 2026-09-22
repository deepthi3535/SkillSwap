import { Link } from 'react-router-dom';
import Card from './ui/Card';
import SkillBadge from './ui/SkillBadge';
import StarRating from './ui/StarRating';

export default function MatchCard({ user, matchPercentage, onRequestSwap }) {
  const matchColor =
    matchPercentage >= 90
      ? 'from-green-500 to-emerald-500'
      : matchPercentage >= 75
      ? 'from-primary-500 to-accent-500'
      : matchPercentage >= 60
      ? 'from-amber-500 to-orange-500'
      : 'from-gray-400 to-gray-500';

  return (
    <Card hover className="flex flex-col h-full group">
      {/* Match badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-100 group-hover:ring-primary-300 transition-all duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 group-hover:text-primary-600 transition-colors">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.college}</p>
          </div>
        </div>
        <div className={`bg-gradient-to-br ${matchColor} text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-md group-hover:scale-105 transition-transform duration-300`}>
          {matchPercentage}% Match
        </div>
      </div>

      <div className="flex-1 space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Teaches</p>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsTeach.slice(0, 4).map((s) => (
              <SkillBadge key={s} skill={s} type="teach" size="sm" />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Wants</p>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsLearn.slice(0, 4).map((s) => (
              <SkillBadge key={s} skill={s} type="learn" size="sm" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <StarRating rating={user.rating} size="sm" />
          <span className="text-sm text-gray-500 ml-1">{user.rating.toFixed(1)}</span>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/users/${user._id}`}
            className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
          >
            View Profile
          </Link>
          <button
            onClick={() => onRequestSwap?.(user)}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-500 hover:shadow-lg rounded-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Request Swap
          </button>
        </div>
      </div>
    </Card>
  );
}
