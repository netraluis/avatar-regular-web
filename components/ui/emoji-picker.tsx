import React, { useState } from "react";
import dynamic from "next/dynamic";
import { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { Button } from "./button";

const EmojiPickerReact = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  selectedEmoji,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div className="relative">
      <Button
        onClick={togglePicker}
        variant="outline"
        className={selectedEmoji ? "text-3xl" : ""}
      >
        {selectedEmoji ? selectedEmoji : "+ Emoji"}
      </Button>
      {showPicker && (
        <div className="absolute z-10 mt-2 bg-white shadow-md rounded p-2">
          <EmojiPickerReact
            emojiStyle={"apple" as EmojiStyle}
            onEmojiClick={(emojiObject: EmojiClickData) => {
              onEmojiSelect(emojiObject.emoji); // Accede correctamente al emoji
              setShowPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
