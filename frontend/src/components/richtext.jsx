import React from 'react';

// Renders the small Markdown subset the assistant uses (paragraphs, lists, bold, italics,
// headings) as React elements, so nothing is injected as raw HTML.

const renderInline = (text, keyPrefix) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={key}>{part.slice(1, -1)}</code>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={key}>{part.slice(1, -1)}</em>;
    return part;
  });
};

const RichText = ({ text }) => {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let list = null;

  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)/);
    const numbered = line.match(/^\d+[.)]\s+(.*)/);

    if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((bullet || numbered)[1]);
      return;
    }

    flushList();
    if (!line || /^[-*_]{3,}$/.test(line)) return;
    const heading = line.match(/^#{1,6}\s+(.*)/);
    blocks.push({ type: heading ? 'h' : 'p', text: heading ? heading[1] : line });
  });
  flushList();

  return (
    <div className="richtext">
      {blocks.map((block, i) => {
        if (block.type === 'ul' || block.type === 'ol') {
          const List = block.type;
          return (
            <List key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item, `${i}-${j}`)}</li>
              ))}
            </List>
          );
        }
        if (block.type === 'h') return <p key={i} className="richtext-heading">{renderInline(block.text, i)}</p>;
        return <p key={i}>{renderInline(block.text, i)}</p>;
      })}
    </div>
  );
};

export default RichText;
