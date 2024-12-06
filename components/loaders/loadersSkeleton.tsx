import { Skeleton } from "../ui/skeleton";

export const InputCharging = () => {
  return <Skeleton className="w-full h-[40px] rounded" />;
};

export const LogoCharging = () => {
  return <Skeleton className="w-10 h-10 rounded-full" />;
};

export const SelectCharging = () => {
  return <Skeleton className="w-[180px] h-10 rounded" />;
};

export const TextAreaCharging = () => {
  return <Skeleton className="w-full h-[100px] rounded" />;
};

export const CustomCardCharging = ({height = '100px', width = 'full'}: {height?: string, width?: string}) => {
  return <Skeleton className={`w-full h-${height} w-[${width}] rounded` }/>;
}
