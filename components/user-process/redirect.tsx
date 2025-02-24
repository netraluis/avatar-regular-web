import { Button } from "@/components/ui/button";

interface ConfirmationScreenProps {
  title: string;
  description?: React.ReactNode;
  buttonText?: string;
  logo?: React.ComponentType<{ className?: string }>;
  onButtonClick?: () => void;
  loading: boolean;
  logoAction?: React.ComponentType<{ className?: string }>;
  logoLoading?: React.ComponentType<{ className?: string }>;
  linkText?: React.ReactNode;
  children?: React.ReactNode;
}

export default function ConfirmationScreen({
  title,
  description,
  buttonText,
  logo: Logo,
  onButtonClick,
  loading,
  logoAction: LogoAction,
  logoLoading: LogoLoading,
  linkText,
  children,
}: ConfirmationScreenProps) {
  return (
    <div className="flex grow items-center justify-center p-4 w-full w-redirect">
      <div className="grow flex flex-col items-start text-start space-y-6">
        {Logo && (
          <div className="w-8 h-8">
            <Logo className="w-full h-full" />
          </div>
        )}
        <div className="space-y-2 w-full">
          <h1 className="text-2xl font-semibold tracking-tight w-full">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground pb-4">{description}</p>
          )}
          {children}
          <p className="mt-4 text-sm text-muted-foreground">
            {linkText && <>{linkText}</>}
          </p>
        </div>

        {buttonText && (
          <Button
            className="w-full max-w-[200px] bg-[#14161A] hover:bg-[#14161A]/90"
            size="lg"
            onClick={onButtonClick}
            disabled={loading}
          >
            {loading
              ? LogoAction && (
                  <LogoAction
                    className="ml-0.5 h-5 w-5 mr-1"
                    aria-hidden="true"
                  />
                )
              : LogoLoading && (
                  <LogoLoading className="ml-0.5 h-5 w-5 animate-spin mr-1" />
                )}
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
