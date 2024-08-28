import Avatar from "./avatar";
import MarkdownDisplay from "./markdownDisplay";

export const ErrorMessage = () => (
  <div>
    <Avatar name="assistant" />
    <div className="ml-12 mt-3.5 flex mb-5">
      <div className="w-full text-red-500">
        <MarkdownDisplay
          markdownText="S'ha excedit el temps d'espera per la petició a OpenAI. 
Si us plau, intenta-ho de nou més tard."
        />
      </div>
    </div>
  </div>
);
