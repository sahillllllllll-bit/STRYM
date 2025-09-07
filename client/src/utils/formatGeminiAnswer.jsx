import React from "react";

export function formatGeminiAnswer(text) {
  const lines = text.split("\n").filter(line => line.trim() !== "");
  const formatted = [];
  let currentList = [];

  lines.forEach(line => {
    line = line.trim();

    // Numbered steps
    if (/^\d+(\.|\))/g.test(line)) {
      if (currentList.length > 0) {
        formatted.push(<ol key={formatted.length} style={{ marginBottom: "15px" }}>{currentList}</ol>);
        currentList = [];
      }
      const content = line.replace(/^\d+(\.|\))/g, "").trim();
      currentList.push(<li key={currentList.length} dangerouslySetInnerHTML={{ __html: content }} />);
    } else if (line.startsWith("*")) {
      const content = line.replace(/^\*/, "").trim();
      const lastItem = currentList[currentList.length - 1];
      if (lastItem) {
        lastItem.props.children = (
          <ul>
            {lastItem.props.children}
            <li dangerouslySetInnerHTML={{ __html: content }} />
          </ul>
        );
      }
    } else {
      if (currentList.length > 0) {
        const lastItem = currentList[currentList.length - 1];
        lastItem.props.children = (
          <>
            {lastItem.props.children}
            <div dangerouslySetInnerHTML={{ __html: line }} />
          </>
        );
      } else {
        formatted.push(<p key={formatted.length} dangerouslySetInnerHTML={{ __html: line }} />);
      }
    }
  });

  if (currentList.length > 0) {
    formatted.push(<ol key={formatted.length} style={{ marginBottom: "15px" }}>{currentList}</ol>);
  }

  return <div>{formatted}</div>;
}
