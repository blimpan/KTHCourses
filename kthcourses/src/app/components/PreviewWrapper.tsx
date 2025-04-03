import { useState, ReactNode } from "react";

interface PreviewWrapperProps {
    children: ReactNode;
    previewLength?: number;
}

export default function PreviewWrapper({ children, previewLength = 250 }: Readonly<PreviewWrapperProps>) {
  const [expanded, setExpanded] = useState(false);

  // Extract text content from the <p> element
  const text = typeof children === "string" ? children : (children as any).props.children;

  if (typeof text !== "string") {
    console.error("PreviewWrapper expects a <p> element containing text.");
    return null;
  }

  // Function to truncate at the nearest space
  const truncateAtSpace = (str: string, length: number) => {
    if (str.length <= length) return str; // No truncation needed
    let cutoff = str.lastIndexOf(" ", length); // Find nearest space before `length`
    return cutoff === -1 ? str.slice(0, length) : str.slice(0, cutoff) + "...";
  };

  return (
    <div className="relative">
      <p>
        {expanded ? text : truncateAtSpace(text, previewLength)}
      </p>
      {text.length > previewLength && (
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="mt-2 text-blue-500 hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
