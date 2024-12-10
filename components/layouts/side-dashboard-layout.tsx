import Link from "next/link";
import { Badge } from "../ui/badge";

export interface NavItemsProps {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  alpha?: boolean;
  commingSoon?: boolean;
}

const commingSoon = {
  title: 'Proximament'
}

export interface SideDashboardLayoutProps {
  navItems: NavItemsProps[];
  comparatePathName: string;
  absolutePath: string;
  actionButtonOnClick?: () => void;
}

export const SideDashboardLayout = ({
  navItems,
  comparatePathName,
  absolutePath,
  actionButtonOnClick,
}: SideDashboardLayoutProps) => {
  return (
    <div className="w-64 scrollbar-hidden overflow-auto flex flex-col">
      <nav>
        {navItems.map((item, index) => (
          <Link
            onClick={actionButtonOnClick}
            key={index}
            href={item.commingSoon ? '' : `/${absolutePath}/${item.href}`}
            className={`flex items-center p-2 hover:bg-slate-100 rounded gap-1.5 px-2 py-1.5 ${comparatePathName === item.href ? "bg-slate-100" : ""}`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <div className="flex grow ">
              {item.name}{" "}
              {item.alpha && (
                <span>
                  <Badge
                    variant="outline"
                    className="text-[0.65rem] px-1.5 py-0 leading-4 ml-2"
                  >
                    Alpha
                  </Badge>
                </span>
              )}
              {item.commingSoon && (
                <span>
                  <Badge
                    variant="outline"
                    className="text-[0.65rem] px-1.5 py-0 leading-4 ml-2"
                  >
                    {commingSoon.title}
                  </Badge>
                </span>
              )}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};
