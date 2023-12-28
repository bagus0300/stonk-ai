import NewsDisplay from "@/components/News/NewsDisplay";

export const metadata = {
  title: "Sentiment News",
}

export default function Home() {
  return (
    <>
      <div className="main">
        <div className="gradient" />
      </div>
      <NewsDisplay />
    </>
  );
}
