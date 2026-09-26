import Script from "next/script";

interface GoogleAnalyticsProps {
  /** Optional override for Google Measurement ID (e.g. 'G-XXXXXXXXXX') */
  gaId?: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  // Uses prop if passed, otherwise falls back to Vercel environment variable
  const measurementId = gaId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Don't render scripts if measurement ID is missing or in disabled environments
  if (!measurementId) {
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
