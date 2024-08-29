'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import StartConversation from './startConversation';
import Welcome from './welcome';
import { GlobalContext } from '@/app/component/context/globalContext';


const ContainerSwitcher = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [show, setShow] = useState(false);

  function useViewportHeight() {
    useEffect(() => {
      function setViewportHeight() {
        const viewportHeight = window.innerHeight;
        document.documentElement.style.setProperty(
          '--viewport-height',
          `${viewportHeight}px`,
        );
      }
      setShow(true);
      setViewportHeight();

      window.addEventListener('resize', setViewportHeight);

      return () => window.removeEventListener('resize', setViewportHeight);
    }, []);
  }
  useViewportHeight();

  // eslint-disable-next-line
  const finalDelContenidoRef = useRef<any>(null);

  useEffect(() => {
    // Mueve el scroll al final del contenedor
    finalDelContenidoRef.current?.scrollIntoView({ behavior: 'smooth' });
  });

  if (!show) return <></>;
  return (
    <div className="flex-grow overflow-auto h-full">
      {children}
      <div ref={finalDelContenidoRef} />
    </div>
  );
};

const ConversationSwitcher = () => {
  const { state } = useContext(GlobalContext);

  switch (state) {
    case 2:
      return (
        <ContainerSwitcher>
          <StartConversation />
        </ContainerSwitcher>
      );
      break;
    default:
      return (
        <ContainerSwitcher>
          <Welcome />
        </ContainerSwitcher>
      );
      break;
  }
};

export default ConversationSwitcher;
