import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X } from "lucide-react";

const puzzles = [
  {
    id: 1,
    title: "GET STARTED",
    subtitle: "decode the first transmission",
    puzzle: "HEAD → HEAL → DEAL → DEAR → ?",
    hint: "Each step changes just one letter to make a new, valid word — follow the flow.",
    answer: "DEAN",
  },
  {
    id: 2,
    title: "CONCLUSION",
    subtitle: "decode the first transmission",
    puzzle: "B, E, H, K, N, ?",
    hint: "Look at how far apart the letters are in the alphabet — the difference repeats in a pattern.",
    answer: "Q",
  },
];

const Mission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");

  const currentPuzzle = puzzles[step];

  const handleSubmit = () => {
    if (answer.toUpperCase().trim() === currentPuzzle.answer) {
      if (step < puzzles.length - 1) {
        toast.success("Correct! Moving to next step...");
        setStep(step + 1);
        setAnswer("");
      } else {
        toast.success("Mission Complete! +100 points");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } else {
      toast.error("Incorrect answer. Try again.");
    }
  };

  return (
    <div className="min-h-screen atmospheric-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              size="icon"
              className="border-2 border-primary glow-border"
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold">Progress</h2>
          </div>
          <span className="text-xl font-semibold">{step + 3}/4</span>
        </div>

        <div className="mb-8">
          <p className="text-center text-muted-foreground mb-2">[Difficulty : Easy]</p>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 glow-text">
            {currentPuzzle.title}
          </h1>
          <p className="text-center text-muted-foreground">
            {currentPuzzle.subtitle}
          </p>
        </div>

        <div className="bg-popover rounded-xl p-8 glow-border mb-8">
          <div className="mb-8">
            <p className="text-xl font-bold mb-4">PUZZLE:</p>
            <p className="text-2xl md:text-3xl font-mono text-center py-6">
              {currentPuzzle.puzzle}
            </p>
          </div>

          <div className="mb-8">
            <p className="text-xl font-bold mb-4">HINT:</p>
            <p className="text-base leading-relaxed bg-muted/30 p-6 rounded-lg">
              {currentPuzzle.hint}
            </p>
          </div>

          <div>
            <Input
              type="text"
              placeholder="Enter answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className="h-16 text-lg mb-4 bg-input border-2 border-primary"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full h-16 text-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default Mission;
