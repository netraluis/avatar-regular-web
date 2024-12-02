import Link from "next/link";

export interface NavItemsProps {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface SideDashboardLayoutProps {
  navItems: NavItemsProps[];
  comparatePathName: string;
  absolutePath: string;
  actionButtonOnClick: () => void;
}

export const SideDashboardLayout = ({
  navItems,
  comparatePathName,
  absolutePath,
  actionButtonOnClick,
}: SideDashboardLayoutProps) => {
  return (
    <div className="w-64 p-4 scrollbar-hidden overflow-auto flex flex-col">
      <nav>
        {navItems.map((item, index) => (
          <Link
            onClick={actionButtonOnClick}
            key={index}
            href={`/${absolutePath}/${item.href}`}
            className={`flex items-center p-2 hover:bg-slate-100 rounded gap-1.5 px-2 py-1.5 ${comparatePathName === item.href ? "bg-slate-100" : ""}`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
