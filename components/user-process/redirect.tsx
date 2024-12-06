import { Button } from "@/components/ui/button";

interface ConfirmationScreenProps {
  title: string;
  description: React.ReactNode;
  buttonText?: string;
  logo: React.ComponentType<{ className?: string }>;
  onButtonClick?: () => void;
  loading: boolean;
  logoAction?: React.ComponentType<{ className?: string }>;
  logoLoading?: React.ComponentType<{ className?: string }>;
  linkText?: React.ReactNode;
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
}: ConfirmationScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full flex flex-col items-start text-start space-y-6">
        <div className="w-8 h-8">
          <Logo className="w-full h-full" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>

          <p className="mt-4 text-muted-foreground">
            {linkText && <div>{linkText}</div>}
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
