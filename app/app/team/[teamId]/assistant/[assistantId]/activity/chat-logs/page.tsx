"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, CalendarIcon } from "lucide-react";
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

export default function Component() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { assistantId } = useParams();
  const pathname = usePathname();

  // Lee los filtros desde los parámetros de la URL
  const page = Number(searchParams.get("page") || 1);
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const { fetchThreadsMessages, dataFetchThreadsMessages, hasMoreMessages } =
    useFetchThreadsMessages();

  const { dataFetchMessageByThread, fetchMessageByThread } =
    useFetchMessageByThread();
  const [date, setDate] = useState<DateRange | undefined>({
    from: dateFrom ? new Date(dateFrom) : undefined,
    to: dateTo ? new Date(dateTo) : undefined,
  });
  const [threadId, setThreadId] = useState<string | undefined>();
  const { state } = useAppContext();

  // Actualiza los datos al cambiar la página o los filtros de fecha
  useEffect(() => {
    fetchThreadsMessages(
      {
        page,
        pageSize: 6,
        limitMessagesPerThread: 2,
        assistantId: assistantId as string,
        dateFrom,
        dateTo,
      },
      state.user?.user?.id as string,
    );
  }, [page, dateFrom, dateTo, assistantId]); // Añadimos `dateFrom` y `dateTo` como dependencias

  useEffect(() => {
    if (threadId) {
      fetchMessageByThread({
        threadId,
        userId: state.user?.user?.id as string,
        assistantId: assistantId as string,
      });
    } else {
      setThreadId(dataFetchThreadsMessages[0]?.threadId);
    }
  }, [threadId, dataFetchThreadsMessages]);

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
    <>
      <div className="w-full px-4 py-2 flex items-center justify-between gap-2 border mb-2 rounded-lg ">
        <div className="flex grow items-center gap-2 flex-1">
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
                  <span>Filtra por fecha de creación</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
          <Button size="sm" className="">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
      <div className="flex grow rounded-lg bg-background overflow-hidden">
        <div className="w-80 flex flex-col overflow-hidden">
          <div className="overflow-auto grow">
            {dataFetchThreadsMessages.map((i, index) => (
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
                        className={
                          msg.role === RoleUserType.USER
                            ? "font-medium "
                            : "text-sm text-muted-foreground"
                        }
                      >
                        {msg.role === RoleUserType.USER ? "User" : "Assistant"}:{" "}
                        {msg.message}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="pr-2">
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
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col border rounded-lg">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex flex-col max-w-100% space-y-2">
              {dataFetchMessageByThread &&
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
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
