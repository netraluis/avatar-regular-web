import { useContext, useEffect } from 'react';
import { useAssistant as useAssistant } from 'ai/react';
import { TextAreaForm } from './textAreaForm';
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor';
import { cn } from '@/lib/utils';
import { ChatList } from './chat-list';
// import { EmptyScreen } from './empty-screen';
import { GlobalContext } from '@/app/component/context/globalContext';

export default function ConversationRecipient() {
  const { setActualThreadId } = useContext(GlobalContext);
  // eslint-disable-next-line
  // const scrollRef = useRef<any>(null);

  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
    threadId,
    append,
  } = useAssistant({
    api: '/api/assistant-stream',
    body: {
      assistantId: undefined,
    },
  });

  // eslint-disable-next-line
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action to avoid a new line
      onClickButton(event);
    }
  };

  // eslint-disable-next-line
  const onClickButton = (e: any) => {
    submitMessage(e);
  };

  // eslint-disable-next-line
  const handleClick = async (e: any, question: string) => {
    append({ content: question, role: 'user' });
  };

  useEffect(() => {
    if (threadId) {
      setActualThreadId(threadId);
    }
  }, [threadId, setActualThreadId]);

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  //   }
  // }, [messages]);

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();
  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div className={cn('pb-[200px] pt-4 md:pt-10')} ref={messagesRef}>
        {messages.length ? <ChatList messages={messages} /> : <></>}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>

      <TextAreaForm
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        input={input}
        status={status}
        submitMessage={submitMessage}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
