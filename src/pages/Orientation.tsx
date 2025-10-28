import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const orientationSteps = [
  {
    title: "Your Mission Awaits",
    subtitle: "Complete objectives to gain influence",
    content: (
      <div className="bg-popover rounded-xl p-8 glow-border">
        <h3 className="text-2xl font-bold mb-6">MISSION TYPES:</h3>
        <ul className="space-y-3 text-lg">
          <li>• Decode cryptic messages</li>
          <li>• Infiltrate networks</li>
          <li>• Gather intelligence</li>
          <li>• Establish protocols</li>
        </ul>
        <p className="mt-6 text-sm text-muted-foreground text-center">
          Each completed mission increases your rank and influence.
        </p>
      </div>
    ),
  },
  {
    title: "Ephemeral Communication",
    subtitle: "Messages that vanish",
    content: (
      <div className="space-y-6">
        <p className="text-lg text-center">
          The society uses encrypted, self-destructing messages. All
          communications expire after 5 minutes.
        </p>
        <div className="bg-popover rounded-xl p-8 glow-border">
          <p className="text-lg font-semibold mb-4">[SECURE CHANNEL ESTABLISHED]</p>
          <p className="text-base">
            Connect with other members. Share intelligence. Leave no trace.
          </p>
          <p className="mt-6 text-sm text-center text-muted-foreground">
            REMEMBER: TRUST NO ONE
          </p>
        </div>
      </div>
    ),
  },
];

const Orientation = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < orientationSteps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };

  const currentStep = orientationSteps[step];

  return (
    <div className="min-h-screen atmospheric-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Orientation</h2>
          <span className="text-xl font-semibold">{step + 2}/4</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 glow-text">
            {currentStep.title}
          </h1>
          <p className="text-center text-muted-foreground text-lg">
            {currentStep.subtitle}
          </p>
        </div>

        <div className="mb-12">{currentStep.content}</div>

        <div className="flex gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1 h-14 text-lg bg-muted hover:bg-muted/80 border-0"
          >
            BACK
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            NEXT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Orientation;
