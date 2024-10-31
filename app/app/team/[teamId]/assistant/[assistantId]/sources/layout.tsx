import {
  Archive,
  FileText,
  Mail,
  MessageSquare,
  HardDrive,
} from "lucide-react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-white">
      <div className="w-64 p-4">
        <nav>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded bg-gray-200"
          >
            <Archive className="mr-2 h-4 w-4" />
            Archives
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <FileText className="mr-2 h-4 w-4" />
            Texts
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <Mail className="mr-2 h-4 w-4" />
            Emails
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Q&A
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <HardDrive className="mr-2 h-4 w-4" />
            Notion
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <HardDrive className="mr-2 h-4 w-4" />
            Dropbox
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <HardDrive className="mr-2 h-4 w-4" />
            Google Drive
          </a>
        </nav>
      </div>
      {children}
    </div>
  );
}
