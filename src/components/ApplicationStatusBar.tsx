import { CheckCircle2, Circle, CreditCard, FileText, Loader2 } from "lucide-react";
import { IndianRupee } from "lucide-react";

interface ApplicationStatusBarProps {
  currentStep: 'application' | 'payment' | 'acknowledgment';
}

export const ApplicationStatusBar = ({ currentStep }: ApplicationStatusBarProps) => {
  const steps = [
    {
      id: 'application',
      label: 'Application',
      icon: FileText,
      completed: true
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: IndianRupee,
      completed: currentStep === 'payment' || currentStep === 'acknowledgment'
    },
    {
      id: 'acknowledgment',
      label: 'Acknowledgment',
      icon: CheckCircle2,
      completed: currentStep === 'acknowledgment'
    }
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
          <div
            className="h-full bg-[#0f698a] transition-all duration-500"
            style={{
              width: currentStep === 'application' ? '0%' :
                     currentStep === 'payment' ? '50%' : '100%'
            }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = step.completed;
          const isCurrent = step.id === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-[#0f698a] text-white'
                    : isCurrent
                    ? 'bg-[#0f698a] text-white border-2 border-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCurrent && !isCompleted ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isCompleted
                    ? 'text-[#0f698a]'
                    : isCurrent
                    ? 'text-[#0f698a]'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 