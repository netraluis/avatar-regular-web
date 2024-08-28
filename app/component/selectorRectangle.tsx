const questions = [
  "Quin cost econòmic i humà suposarà per a...",
  "Quines qüestions estan incloses en l’Acord?",
  "Canviarà la situació respecte a l’euro?",
  "Quines són les altres experiències d’acords ...",
];

export default function SelectorRectangle({ handleClick }: any) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-4">
      {questions.map((question: string) => (
        <div
          onClick={(e) => handleClick(e, question)}
          key={question}
          className="relative flex items-center rounded-xl border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-gray-500">{question}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
