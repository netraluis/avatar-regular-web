"use client";
import { Fragment, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { XMarkIcon, Bars3CenterLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useTeamAssistantContext } from "./context/teamAssistantContext";
import { basePublicUrl } from "@/lib/helper/images";
import { MenuHeaderType } from "@prisma/client";
import { Button } from "./ui/button";
import { House, MessageCircle } from "lucide-react";
import Disclaimer from "./disclaimer";
import { HeaderDisclaimer } from "./context/globalContext";
import Link from "next/link";
import { FooterText } from "./footer";

const ensureProtocol = (url: string) => {
  if (!url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

export default function Header() {
  const { data, useAssistantResponse } = useTeamAssistantContext();

  const { lang, assistantUrl } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const returnToInicial = () => {
    useAssistantResponse?.setInternalThreadId(undefined);
    useAssistantResponse?.setMessages([]);
    router.push(`/${lang}`);
  };

  const startNewConversation = () => {
    useAssistantResponse?.setInternalThreadId(undefined);
    useAssistantResponse?.setMessages([]);
  };

  const menuHeader = data?.menuHeader
    ?.find((menu) => menu.type === MenuHeaderType.HEADER)
    ?.textHref?.sort((a, b) => a.numberOrder - b.numberOrder);
  const menuBody = data?.menuHeader
    ?.find((menu) => menu.type === MenuHeaderType.BODY)
    ?.textHref?.sort((a, b) => a.numberOrder - b.numberOrder);
  const menuFooter = data?.menuFooter[0]?.text;
  const headerButton = data?.headerButton[0];

  return (
    <div className="bg-white pt-4 fixed top-0 z-10 w-full">
      <nav
        className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16"
        aria-label="Global"
      >
        <div
          onClick={returnToInicial}
          className="relative h-[74px] aspect-video overflow-hidden cursor-pointer"
        >
          {data?.logoUrl ? (
            <Image
              src={`${basePublicUrl}${typeof data.logoUrl === "string" && data.logoUrl}`}
              alt={""}
              fill
              className="object-contain object-left"
              unoptimized
            />
          ) : (
            // <div className="h-[74px] aspect-video  flex border border-slate-200 justify-center content-center self-center justify-items-center rounded-lg">
            //   <CameraIcon
            //     className="ml-0.5 w-6 animate-pulse mr-1 text-slate-400"
            //     aria-hidden="true"
            //   />
            // </div>
            <Image
              src="/chatbotforLogo.svg"
              alt={""}
              fill
              className="object-contain object-left"
              unoptimized
            />
          )}
        </div>
        <div className="flex lg:hidden my-3">
          {headerButton && (
            <Disclaimer data={headerButton as unknown as HeaderDisclaimer} />
          )}
          {/* Botón mejorado con mayor área táctil y color de fondo para mayor visibilidad */}
          <button
            type="button"
            className="p-3 rounded-full text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Open main menu</span>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12 lg:items-center">
          {/* Elementos de navegación para desktop */}
          {assistantUrl && (
            <Button variant="outline" onClick={() => returnToInicial()}>
              <House className="h-5 w-5 mr-2" />
              Tornar a l&rsquo;inici
            </Button>
          )}
          {assistantUrl &&
            useAssistantResponse?.messages &&
            useAssistantResponse?.messages?.length > 0 && (
              <Button onClick={() => startNewConversation()}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Nova conversa
              </Button>
            )}
          {headerButton && (
            <Disclaimer data={headerButton as unknown as HeaderDisclaimer} />
          )}
          {((menuHeader && menuHeader.length > 0) ||
            (menuBody && menuBody.length > 0)) && (
            <Popover className="relative">
              <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-8 text-gray-900">
                <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute -right-8 top-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                  <div className="px-4 pt-5 pb-3">
                    {menuHeader?.map((item) => (
                      <div
                        key={item.numberOrder}
                        className="group relative flex items-center gap-x-6 rounded-lg px-4 py-2 text-base leading-6 hover:bg-gray-50"
                      >
                        <div className="flex-auto">
                          <Link
                            href={ensureProtocol(
                              item.hrefLanguages[0]?.href || "",
                            )}
                            className="block font-semibold text-gray-900"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.hrefLanguages[0]?.text}
                            <span className="absolute inset-0" />
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className="mt-5">
                      {menuBody?.map((item) => (
                        <Link
                          href={ensureProtocol(
                            item.hrefLanguages[0]?.href || "",
                          )}
                          key={item.numberOrder}
                          className="group relative flex items-center gap-x-4 rounded-lg px-4 py-2 text-xs leading-3 hover:bg-gray-50"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="flex-auto">
                            <p className=" text-gray-600">
                              {item.hrefLanguages[0]?.text}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-5 pt-3 border-t-2 w-full">
                      <FooterText
                        className="hidden sm:block"
                        text={menuFooter}
                      />
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          )}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden "
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <div className="fixed inset-0 z-10 bg-black bg-opacity-25" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition duration-300 ease-in-out transform flex flex-col">
          {/* Encabezado del menú móvil con mejor diseño */}
          <div className="flex items-center justify-between ">
            <div className="p-1.5">
              <h3 className="leading-6">MENU</h3>
            </div>

            <button
              type="button"
              className="rounded-full p-3 text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          {/* Menú móvil con mejor accesibilidad y diseño */}
          <div className="flex-grow space-y-6">
            <div className="py-4 flex flex-col">
              {menuHeader?.map((item, index) => (
                <Link
                  key={index}
                  href={ensureProtocol(item.hrefLanguages[0]?.href || "")}
                  className="font-semibold text-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-full group flex items-center gap-x-6 rounded-lg px-4 py-2 text-lg leading-6 hover:bg-gray-50">
                    <div className="flex-auto">
                      {item.hrefLanguages[0]?.text}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div>
              {assistantUrl &&
                useAssistantResponse?.messages &&
                useAssistantResponse?.messages?.length > 0 && (
                  <Button
                    size="lg"
                    className="ml-2"
                    onClick={() => startNewConversation()}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Nova conversa
                  </Button>
                )}
            </div>
            <div>
              {assistantUrl && (
                <Button
                  size="lg"
                  className="ml-2"
                  onClick={() => returnToInicial()}
                  variant="outline"
                >
                  <House className="h-5 w-5 mr-2" />
                  Tornar a l&rsquo;inici
                </Button>
              )}
            </div>
            <div className="mt-7 pt-6 ">
              {menuBody?.map((item) => (
                <Link
                  href={ensureProtocol(item.hrefLanguages[0]?.href || "")}
                  key={item.numberOrder}
                  className="group relative flex items-center gap-x-4 rounded-lg text-xs leading-4 hover:bg-gray-50 my-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex-auto">
                    <p className="text-gray-600">
                      {item.hrefLanguages[0]?.text}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-1 border-t-2 w-full">
            <div className="flex ">
              <div
                dangerouslySetInnerHTML={{
                  __html: menuFooter || "",
                }}
              />
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
