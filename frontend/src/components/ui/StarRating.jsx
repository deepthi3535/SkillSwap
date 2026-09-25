export default function StarRating({ rating, size = 'md', interactive = false, onChange }) {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-3xl' };

  return (
    <div className={`flex items-center gap-0.5 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'} transition-all duration-200 ease-spring`}
        >
          <span className={`transition-colors ${star <= rating ? 'text-amber-400' : 'text-gray-300'} ${interactive && star <= rating ? 'drop-shadow-sm' : ''}`}>★</span>
        </button>
      ))}
    </div>
  );
}
