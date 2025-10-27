import { AIQueryBar } from "../ai-query-bar";

export default function AIQueryBarExample() {
  return (
    <div className="p-8">
      <AIQueryBar
        onSubmit={(query) => console.log("Query submitted:", query)}
      />
    </div>
  );
}
