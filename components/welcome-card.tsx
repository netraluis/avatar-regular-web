import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useContext } from "react";
import { GlobalContext } from "./context/globalContext";

// Tipos para las props
interface AvatarEmojiProps {
  emoji: string;
  altText: string;
}

interface CardComponentProps {
  title: string;
  description: string;
  emoji: string;
}

// Componente Avatar Emoji
const AvatarEmoji: React.FC<AvatarEmojiProps> = ({ emoji, altText }) => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
    <span className="text-2xl" role="img" aria-label={altText}>
      {emoji}
    </span>
  </div>
);

// Componente para una Tarjeta
const CardComponent: React.FC<CardComponentProps> = ({
  title,
  description,
  emoji,
}) => {
  return (
    <Card
      className="w-64 min-h-[100px] border shadow-sm rounded-lg flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg" // Añadimos hover aquí
    >
      <CardHeader className="flex-row items-center space-x-4">
        <AvatarEmoji emoji={emoji} altText={title} />
        <div className="flex-1">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm text-gray-600">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

// Componente principal que renderiza varias tarjetas
export default function Dashboard() {
  const { setState, domainData } = useContext(GlobalContext);

  return (
    <div className="flex justify-center space-x-4 p-4">
      {domainData.welcomeCards.map((card, index) => (
        <div
          key={index}
          onClick={() =>
            setState({
              position: 2,
              voiceId: card.voiceId,
              avatarId: card.avatarId,
              assistantId: card.assistantId,
            })
          }
        >
          <CardComponent
            key={index}
            title={card.title}
            description={card.description}
            emoji={card.emoji}
          />
        </div>
      ))}
    </div>
  );
}
