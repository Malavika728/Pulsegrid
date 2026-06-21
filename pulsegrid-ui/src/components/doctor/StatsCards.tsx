export default function StatsCards() {
  const stats = [
    {
      title: "Active Patients",
      value: "324",
      color: "text-teal-600",
    },
    {
      title: "Critical Cases",
      value: "18",
      color: "text-red-500",
    },
    {
      title: "Alerts Today",
      value: "42",
      color: "text-orange-500",
    },
    {
      title: "Recovery Rate",
      value: "87%",
      color: "text-cyan-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 transition-shadow hover:shadow-md"
        >
          <p className="text-sm md:text-base text-slate-500">
            {item.title}
          </p>

          <h3
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 md:mt-4 ${item.color}`}
          >
            {item.value}
          </h3>
        </div>
      ))}
    </div>
  );
}