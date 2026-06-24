export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-surface h-24 shimmer-bg rounded-xl" />
        ))}
      </div>
      <div className="card-surface h-72 shimmer-bg rounded-xl" />
      <div className="card-surface h-48 shimmer-bg rounded-xl" />
    </div>
  );
}
