"use client";
import { Fragment, useState, useContext, useEffect } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  Bars3CenterLeftIcon,
  ChatBubbleLeftIcon,
  ArrowRightStartOnRectangleIcon,
  CameraIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { Domain, GlobalContext } from "./context/globalContext";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Disclaimer from "./disclaimer";
import { usePathname } from "next/navigation";

export default function Header({ domain }: { domain: Domain }) {
  const {
    setActualsThreadId,
    actualThreadId,
    actualsThreadId,
    state,
    setState,
    setUser,
    user,
    setDomainData,
    domainData,
  } = useContext(GlobalContext);

  useEffect(() => {
    setDomainData(domain);
  }, [domain]);

  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const createNovaConversa = () => {
    setActualsThreadId([...actualsThreadId, actualThreadId]);
    setMobileMenuOpen(false);
    localStorage.setItem("new-talk", JSON.stringify(actualThreadId));
  };
  const supabase = createClient();
  const router = useRouter();

  // Verificar si el usuario tiene sesión
  useEffect(() => {
    const getSession = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setUser(sessionData?.session?.user || null);
      }
    };

    getSession();

    // Listener para cambios de autenticación (ej: sign in/out)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (session) {
          getSession(); // Forzar actualización manual después del cambio de auth
        } else {
          router.push("/login");
        }
      },
    );

    // Limpia el listener al desmontar el componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const returnToInicial = () => {
    setActualsThreadId([""]);
    setState({ position: 1 });
    router.push("/");
  };

  if (pathname === "/login" || pathname === "/signup") {
    return (
      <div className="bg-transparent pt-4 fixed top-0 z-40 w-full">
        <nav
          className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16"
          aria-label="Global"
        >
          <div onClick={returnToInicial}>
            <span className="sr-only">Your Company</span>
            {domainData?.logo ? (
              <Image
                src={domainData?.logo}
                alt={domainData?.description || ""}
                width={209}
                height={74}
              />
            ) : (
              <div className="w-[209px] h-[74px] flex border border-slate-200 justify-center content-center self-center justify-items-center rounded-lg">
                <CameraIcon
                  className="ml-0.5 w-6 animate-pulse mr-1 text-slate-400"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </nav>
      </div>
    );
  }

  if (pathname === "/avatar") {
    return (
      <div className="bg-transparent pt-4 fixed top-0 z-40 w-full">
        <nav
          className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-26"
          aria-label="Global"
        >
          <div onClick={returnToInicial}>
            <span className="sr-only">Your Company</span>
            {domainData?.logo ? (
              <Image
                src="/cub_logo.png"
                alt={domainData?.description || ""}
                width={109}
                height={44}
              />
            ) : (
              <div className="w-[209px] h-[74px] flex border border-slate-200 justify-center content-center self-center justify-items-center rounded-lg">
                <CameraIcon
                  className="ml-0.5 w-6 animate-pulse mr-1 text-slate-400"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="pt-4 fixed top-0 z-10 w-full bg-white/95">
      <nav
        className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16"
        aria-label="Global"
      >
        <div
          onClick={returnToInicial}
          className="cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          <span className="sr-only">Your Company</span>
          {domainData?.logo ? (
            <Image
              src={domainData?.logo}
              alt={domainData?.description || ""}
              width={209}
              height={74}
            />
          ) : (
            <div className="w-[209px] h-[74px] flex border border-slate-200 justify-center content-center self-center justify-items-center rounded-lg">
              <CameraIcon
                className="ml-0.5 w-6 animate-pulse mr-1 text-slate-400"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        <div className="flex lg:hidden my-3">
          <Disclaimer data={domainData?.headerDisclaimer} />
          {/* Botón mejorado con mayor área táctil y color de fondo para mayor visibilidad */}
          <button
            type="button"
            className="p-3 rounded-full text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Open main menu</span>
          </button>
          {/* {user && (
            <div className="p-3 rounded-full text-gray-700 hover:bg-gray-50">
              <form action="/api/auth/signout" method="post">
                <button className="button block text-gray-600" type="submit">
                  <ArrowRightStartOnRectangleIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </form>
            </div>
          )} */}
        </div>
        <div className="hidden lg:flex lg:gap-x-4 lg:items-center">
          {/* Elementos de navegación para desktop */}
          {state.position === 2 && (
            <>
              <Button variant="outline" size="lg" onClick={returnToInicial}>
                <HomeIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                Tornar a l&apos;inici
              </Button>
              <Button size="lg" onClick={() => createNovaConversa()}>
                <ChatBubbleLeftIcon
                  className="h-5 w-5 mr-1"
                  aria-hidden="true"
                />
                Nova conversa
              </Button>
            </>
          )}
          <Disclaimer data={domainData?.headerDisclaimer} />
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
                  {domainData?.menuHeader &&
                    domainData?.menuHeader?.map((item) => (
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
                  {user && (
                    <div className="p-3 rounded-full text-gray-700 hover:bg-gray-50">
                      <form action="/api/auth/signout" method="post">
                        <button
                          className="button block text-gray-600 flex"
                          type="submit"
                        >
                          <ArrowRightStartOnRectangleIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                          <div className="ml-2">Tancar sessió</div>
                        </button>
                      </form>
                    </div>
                  )}
                  <div className="mt-5">
                    {domainData?.menuBody &&
                      domainData.menuBody.map((item) => (
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
                      {domainData?.menufooter}
                      {/* Fet amb{" "}
                      <span>
                        <HeartIcon className="h-5 w-6" aria-hidden="true" />
                      </span>{" "}
                      a Andorra i per andorra */}
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          {/* {!!user && (
            <div>
              <form action="/api/auth/signout" method="post">
                <button className="button block text-gray-600" type="submit">
                  <ArrowRightStartOnRectangleIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </form>
            </div>
          )} */}
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
              {domainData?.menuHeader &&
                domainData.menuHeader.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="font-semibold text-gray-900"
                  >
                    <div
                      key={item.name}
                      className="w-full group flex items-center gap-x-6 rounded-lg px-4 py-2 text-lg leading-6 hover:bg-gray-50"
                    >
                      <div className="flex-auto">{item.name}</div>
                    </div>
                  </a>
                ))}
            </div>
            {!!user && (
              <div>
                <form action="/api/auth/signout" method="post">
                  <button
                    className="button block text-gray-600 flex"
                    type="submit"
                  >
                    <ArrowRightStartOnRectangleIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                    <div className="ml-2">Tancar sessió</div>
                  </button>
                </form>
              </div>
            )}
            {state.position === 2 && (
              <>
                <Button
                  size="lg"
                  className="ml-2 mb-7"
                  onClick={() => createNovaConversa()}
                >
                  <ChatBubbleLeftIcon
                    className="h-5 w-5 mr-1"
                    aria-hidden="true"
                  />
                  Nova conversa
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="ml-2 mb-7"
                  onClick={returnToInicial}
                >
                  <HomeIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                  Tornar a l&apos;inici
                </Button>
              </>
            )}
            <div className="mt-7 pt-6 ">
              {domainData?.menuBody &&
                domainData.menuBody.map((item) => (
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
            <div className="flex ">
              <div
                dangerouslySetInnerHTML={{
                  __html: domainData?.menufooter || "",
                }}
              />
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
