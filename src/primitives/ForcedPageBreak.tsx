export default function ForcedPageBreak() {
  return (
    <div className="hidden print:block">
      <div className="print-pagebreak"></div>
    </div>
  );
}