export default function TransportPackageView({ pkg }: { pkg: any }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-[#F9C344] mb-4">Transportation Package</h1>
      <h2 className="text-2xl text-white mb-2">{pkg.title}</h2>
      <p className="text-gray-500">Vehicle Booking details coming soon.</p>
    </div>
  );
}