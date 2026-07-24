export default function ExploreSaudiPackageView({ pkg }: { pkg: any }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-[#F9C344] mb-4">Explore Saudi Package</h1>
      <h2 className="text-2xl text-white mb-2">{pkg.title}</h2>
      <p className="text-gray-500">Tourism details coming soon.</p>
    </div>
  );
}