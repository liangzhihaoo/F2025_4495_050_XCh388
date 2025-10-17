

const EMBED_URL =
  'https://us.posthog.com/embedded/E12XD0uFF9w5SqrfIvyfk5aGy2TFvQ';

export default function FunnelAnalytics() {
  return (
    <div className="p-4 h-[calc(100vh-6rem)]">
      <div className="h-full w-full rounded-xl shadow border bg-white overflow-hidden">
        <iframe
          src={EMBED_URL}
          title="Onboarding Funnel — PostHog"
          className="w-full h-full"
          loading="lazy"
          allowFullScreen
          frameBorder={0}
        />
      </div>
    </div>
  );
}
