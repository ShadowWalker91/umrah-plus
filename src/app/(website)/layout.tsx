import Footer from "@/components/Footer"; // Assuming you have a Footer component

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen">
        {children}
      </main>
      {<Footer />}
    </>
  );
}