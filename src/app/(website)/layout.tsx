import Header from "@/components/Header";
import Footer from "@/components/Footer"; // Assuming you have a Footer component

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      {<Footer />}
    </>
  );
}