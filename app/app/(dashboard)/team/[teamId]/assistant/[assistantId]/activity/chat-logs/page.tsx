"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  useFetchMessageByThread,
  useFetchThreadsMessages,
} from "@/components/context/useAppContext/message";
import { useAppContext } from "@/components/context/appContext";
import { RoleUserType } from "@prisma/client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useParams } from "next/navigation";
import {
  InputCharging,
  CustomCardCharging,
} from "@/components/loaders/loadersSkeleton";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export default function Component() {
  const { t } = useDashboardLanguage();
  const chatlogs = t("app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.ACTIVITY.PAGE");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { assistantId, teamId } = useParams();
  const pathname = usePathname();

  // Lee los filtros desde los parámetros de la URL
  const page = Number(searchParams.get("page") || 1);
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const {
    fetchThreadsMessages,
    dataFetchThreadsMessages,
    hasMoreMessages,
    loadingFetchThreadsMessages,
  } = useFetchThreadsMessages();

  const {
    dataFetchMessageByThread,
    fetchMessageByThread,
    loadingFetchMessageByThread,
  } = useFetchMessageByThread();
  const [date, setDate] = useState<DateRange | undefined>({
    from: dateFrom ? new Date(dateFrom) : undefined,
    to: dateTo ? new Date(dateTo) : undefined,
  });
  const [threadId, setThreadId] = useState<string | undefined>();
  const { state } = useAppContext();

  // Actualiza los datos al cambiar la página o los filtros de fecha
  useEffect(() => {
    if (!state.user?.user.id) {
      return router.push(`/login`);
    }
    fetchThreadsMessages(
      {
        page,
        pageSize: 6,
        limitMessagesPerThread: 2,
        assistantId: assistantId as string,
        dateFrom,
        dateTo,
        teamId: teamId as string,
      },
      state.user?.user.id as string,
    );
  }, [page, dateFrom, dateTo, assistantId]); // Añadimos `dateFrom` y `dateTo` como dependencias

  useEffect(() => {
    const updateFetchMessageByThread = async () => {
      if (!state.user?.user.id) {
        return router.push(`/login`);
      }
      if (threadId) {
        await fetchMessageByThread({
          threadId,
          userId: state.user.user.id,
          assistantId: assistantId as string,
          teamId: teamId as string,
        });
      } else {
        setThreadId(dataFetchThreadsMessages[0]?.threadId);
      }
    };

    updateFetchMessageByThread();
  }, [threadId, dataFetchThreadsMessages]);

  useEffect(() => {
    setThreadId(dataFetchThreadsMessages[0]?.threadId);
  }, [dataFetchThreadsMessages]);

  // Función para actualizar un filtro específico en la URL
  const updateUrlParams = (key: string, value: string | number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== undefined) {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const deleteUrlParams = () => {
    setDate(undefined);
    router.push(`${pathname}`);
  };

  // Función para cambiar de página
  const handlePageChange = (newPage: number) => {
    updateUrlParams("page", newPage);
  };

  // Función para actualizar el rango de fechas en la URL
  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from) {
      updateUrlParams("dateFrom", format(range.from, "yyyy-MM-dd"));
    }
    if (range?.to) {
      updateUrlParams("dateTo", format(range.to, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="overflow-auto flex flex-col grow h-full">
      <div className="w-full px-4 py-2 flex items-center justify-between gap-2 md:border mb-2 rounded-lg flex-wrap">
        <div className="flex grow items-center gap-2 flex-1 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>{chatlogs.filterByData}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              xwxw
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center ">
          <Button size="sm" className="" onClick={deleteUrlParams}>
            {/* <Download className="w-4 h-4 mr-1" /> */}
            {chatlogs.restartFilters}
          </Button>
        </div>
      </div>
      <div className="flex grow rounded-lg bg-background overflow-auto ">
        <div className="w-full md:w-80 flex flex-col overflow-auto h-full">
          {!loadingFetchThreadsMessages ? (
            <div className="overflow-auto grow scrollbar-hidden grow">
              {dataFetchThreadsMessages.length > 0 ? (
                dataFetchThreadsMessages.map((i, index) => (
                  <>
                    <div
                      onClick={() => setThreadId(i.threadId)}
                      key={index}
                      className={cn(
                        "p-4 mb-2 mr-2 rounded-lg border hover:bg-muted/50 cursor-pointer hover:scale",
                        i.threadId === threadId && "bg-muted",
                      )}
                    >
                      <div className="space-y-1">
                        {i.messages.map((msg: any, index: number) => {
                          return (
                            <p
                              key={index}
                              className={`h-[40px] overflow-hidden ${
                                msg.role === RoleUserType.USER
                                  ? "font-medium "
                                  : "text-sm text-muted-foreground"
                              }`}
                            >
                              {msg.role === RoleUserType.USER
                                ? "User"
                                : "Assistant"}
                              : {msg.message}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                    {i.threadId === threadId && (
                      <div className="md:hidden flex-1 flex flex-col rounded-lg mb-2">
                        <div className="flex-1 overflow-auto p-4 space-y-4 scrollbar-hidden">
                          <div className="flex flex-col max-w-100% space-y-2 scrollbar-hidden overflow-auto">
                            {!loadingFetchMessageByThread ? (
                              threadId &&
                              dataFetchMessageByThread &&
                              dataFetchMessageByThread.map(
                                (message, index: number) => (
                                  <div
                                    key={index}
                                    className={`rounded-lg p-3 ${
                                      message.role === RoleUserType.USER
                                        ? "bg-slate-300 "
                                        : "bg-muted"
                                    } `}
                                  >
                                    <p>{message.message}</p>
                                  </div>
                                ),
                              )
                            ) : (
                              <>
                                <InputCharging />
                                <InputCharging />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ))
              ) : (
                <div className="h-full grow p-4 mr-2 rounded-lg border flex justify-center items-center">
                  <>{chatlogs.noData}</>
                </div>
              )}
            </div>
          ) : (
            <div className="mr-2 mb-2 h-full">
              <CustomCardCharging height="full" />
            </div>
          )}
          {dataFetchThreadsMessages.length > 0 && (
            <>
              <div className="pr-2">
                {!loadingFetchThreadsMessages ? (
                  <Pagination className="border mr-2 rounded-lg">
                    <PaginationContent>
                      {page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(page - 1)}
                          />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(1)}>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      {hasMoreMessages && (
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(page + 1)}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                ) : (
                  <InputCharging />
                )}
              </div>
            </>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="hidden flex-1 md:flex flex-col border rounded-lg">
          <div className="flex-1 overflow-auto p-4 space-y-4 scrollbar-hidden">
            <div className="flex flex-col max-w-100% space-y-2 scrollbar-hidden overflow-auto">
              {!loadingFetchMessageByThread ? (
                threadId &&
                dataFetchMessageByThread &&
                dataFetchMessageByThread.map((message, index: number) => (
                  <div
                    key={index}
                    className={`rounded-lg p-3 ${
                      message.role === RoleUserType.USER
                        ? "bg-slate-300 "
                        : "bg-muted"
                    } `}
                  >
                    <p>{message.message}</p>
                  </div>
                ))
              ) : (
                <>
                  <InputCharging />
                  <InputCharging />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
