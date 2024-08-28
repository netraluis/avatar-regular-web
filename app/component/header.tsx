"use client";
import { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  Bars3CenterLeftIcon,
  CheckCircleIcon,
  ChatBubbleLeftIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  ArrowPathIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Button from "./button";
import { GlobalContext } from "./context/globalContext";
const products = [
  {
    name: "Actualitat",
    description: "Get a better understanding of your traffic",
    href: "https://andorraue.ad/actualitat/",
    icon: ChartPieIcon,
  },
  {
    name: "Publicacions",
    description: "Speak directly to your customers",
    href: "https://andorraue.ad/publicacions/",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Qui som?",
    description: "Your customers’ data will be safe and secure",
    href: "https://andorraue.ad/qui-som/",
    icon: FingerPrintIcon,
  },
  {
    name: "Preguntes frequents",
    description: "Connect with third-party tools",
    href: "https://andorraue.ad/preguntes-frecuents/",
    icon: SquaresPlusIcon,
  },
  {
    name: "Sala de premsa",
    description: "Build strategic funnels that will convert",
    href: "https://www.govern.ad/mes-informacio/comunicats-de-premsa",
    icon: ArrowPathIcon,
  },
  {
    name: "Ajuda",
    description: "Your customers’ data will be safe and secure",
    href: "mailto:andorraue@govern.ad",
    icon: CheckCircleIcon,
  },
];

const footer = [
  {
    description: "Política de privacitat",
    href: "https://andorraue.ad/politica-de-cookies/",
  },
  {
    description: "Termes i condicions",
    href: "https://andorraue.ad/politica-privacitat/",
  },
  {
    description: "Política de cookies",
    href: "https://andorraue.ad/termes-i-condicions/",
  },
];
export default function Header() {
  const { setActualsThreadId, actualThreadId, actualsThreadId, state } =
    useContext(GlobalContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function useViewportHeight() {
    useEffect(() => {
      function setViewportHeight() {
        const viewportHeight = window.innerHeight;
        document.documentElement.style.setProperty(
          "--viewport-height",
          `${viewportHeight}px`
        );
      }
      setViewportHeight();

      window.addEventListener("resize", setViewportHeight);

      return () => window.removeEventListener("resize", setViewportHeight);
    }, []);
  }

  useViewportHeight();

  const createNovaConversa = () => {
    setActualsThreadId([...actualsThreadId, actualThreadId]);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white mt-4">
      <nav
        className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16"
        aria-label="Global"
      >
        <a href="#">
          <span className="sr-only">Your Company</span>
          <Image src="/logo.png" alt="logo" width={209} height={74} />
        </a>
        <div className="flex lg:hidden my-3">
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
          {state === 2 && (
            <Button onClick={() => createNovaConversa()}>
              <ChatBubbleLeftIcon className="h-5 w-5" aria-hidden="true" />
              Nova conversa
            </Button>
          )}
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
                  {products.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg px-4 py-2 text-base leading-6 hover:bg-gray-50"
                    >
                      <div className="flex-auto">
                        <a
                          href={item.href}
                          className="block font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                      </div>
                    </div>
                  ))}
                  <div className="mt-5">
                    {footer.map((item) => (
                      <a
                        href={item.href}
                        key={item.description}
                        className="group relative flex items-center gap-x-4 rounded-lg px-4 py-2 text-xs leading-3 hover:bg-gray-50"
                      >
                        <div className="flex-auto">
                          <p className=" text-gray-600">{item.description}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="mt-5 pt-3 border-t-2 w-full">
                    <div className="flex justify-center">
                      Fet amb{" "}
                      <span>
                        <HeartIcon className="h-5 w-6" aria-hidden="true" />
                      </span>{" "}
                      a Andorra i per andorra
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
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
            <a href="#" className="p-1.5">
              <h3 className="leading-6">MENU</h3>
              {/* <img className="h-8 w-auto" src="/logo.png" alt="logo" />
              <Image src="/logo.png" alt="logo" width={156.75} height={55.5} /> */}
            </a>

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
              {products.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="font-semibold text-gray-900"
                >
                  <div
                    key={item.name}
                    className="w-full group flex items-center gap-x-6 rounded-lg px-4 py-2 text-lg leading-6 hover:bg-gray-50"
                  >
                    {/* Comentado para simplificar
                <div className="h-11 w-11 flex-none rounded-lg bg-gray-50 group-hover:bg-white flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                </div> */}
                    <div className="flex-auto">
                      {item.name}
                      {/* <p className="mt-1 text-gray-600">{item.description}</p> */}
                    </div>
                  </div>
                </a>
              ))}
            </div>
            {state === 2 && (
              <Button
                className="ml-2 mb-7"
                onClick={() => createNovaConversa()}
              >
                <ChatBubbleLeftIcon className="h-5 w-5" aria-hidden="true" />
                Nova conversa
              </Button>
            )}
            <div className="mt-7 pt-6 ">
              {footer.map((item) => (
                <a
                  href={item.href}
                  key={item.description}
                  className="group relative flex items-center gap-x-4 rounded-lg text-xs leading-4 hover:bg-gray-50 my-3"
                >
                  <div className="flex-auto">
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-1 border-t-2 w-full">
            {/* <p className="flex">
              Fet amb amor per andorra{" "}
              <span>
                <HeartIcon className="h-5 w-6" aria-hidden="true" />
              </span>
            </p> */}
            <div className="flex ">
              Fet amb{" "}
              <span>
                <HeartIcon className="h-5 w-6" aria-hidden="true" />
              </span>{" "}
              a Andorra i per andorra
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
