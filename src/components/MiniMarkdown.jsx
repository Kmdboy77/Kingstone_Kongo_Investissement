// Mini-rendu markdown → JSX, sans dépendance externe.
// Gère : ## titres, **gras**, [texte](lien), > citations (encadré d'avertissement),
// listes à puces "- ", paragraphes. Suffisant pour nos documents légaux internes ;
// ne prétend pas gérer le markdown complet.

function renderInline(text, keyPrefix) {
  // Découpe la ligne en segments: gras **..**, liens [..](..), texte brut
  const parts = [];
  let rest = text;
  let i = 0;
  const pattern = /(\*\*(.+?)\*\*)|(\[(.+?)\]\((.+?)\))/;
  while (rest.length) {
    const m = rest.match(pattern);
    if (!m) { parts.push(rest); break; }
    if (m.index > 0) parts.push(rest.slice(0, m.index));
    if (m[1]) {
      parts.push(<strong key={`${keyPrefix}-${i++}`} className="text-neutral-300 font-semibold">{m[2]}</strong>);
    } else if (m[3]) {
      parts.push(
        <a key={`${keyPrefix}-${i++}`} href={m[5]} className="text-gold underline hover:text-gold/80 transition-colors">
          {m[4]}
        </a>
      );
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return parts;
}

export default function MiniMarkdown({ text }) {
  const lines = text.split("\n");
  const blocks = [];
  let listBuffer = [];
  let paraBuffer = [];

  function flushList(key) {
    if (listBuffer.length) {
      blocks.push(
        <ul key={`ul-${key}`} className="list-disc list-inside space-y-1.5 mb-4 text-neutral-400">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="text-xs leading-relaxed">{renderInline(item, `li-${key}-${idx}`)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  }
  function flushPara(key) {
    if (paraBuffer.length) {
      blocks.push(
        <p key={`p-${key}`} className="text-xs text-neutral-500 leading-relaxed mb-4">
          {renderInline(paraBuffer.join(" "), `p-${key}`)}
        </p>
      );
      paraBuffer = [];
    }
  }

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      flushList(idx); flushPara(idx);
      blocks.push(
        <h2 key={`h-${idx}`} className="text-sm font-bold text-white mt-8 mb-3 tracking-wide first:mt-0">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("> ")) {
      flushList(idx); flushPara(idx);
      blocks.push(
        <div key={`bq-${idx}`} className="mb-4 p-3 rounded-xl bg-gold/5 border border-gold/20">
          <p className="text-[11px] text-gold/90 leading-relaxed">{renderInline(line.replace("> ", ""), `bq-${idx}`)}</p>
        </div>
      );
    } else if (line.startsWith("- ")) {
      flushPara(idx);
      listBuffer.push(line.replace("- ", ""));
    } else if (line === "") {
      flushList(idx); flushPara(idx);
    } else {
      paraBuffer.push(line);
    }
  });
  flushList("end"); flushPara("end");

  return <div>{blocks}</div>;
}
