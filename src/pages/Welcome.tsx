import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Welcome = () => {
  const [phrase, setPhrase] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {
    if (phrase.trim()) {
      navigate("/auth");
    }
  };

  const handleCrypticHunt = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen atmospheric-bg flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl md:text-7xl font-bold text-center mb-16 glow-text">
        Welcome to Sekretos v1.0
      </h1>

      <div className="w-full max-w-2xl space-y-6">
        <Input
          type="password"
          placeholder="Enter secret phrase to proceed"
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleEnter()}
          className="h-16 text-lg bg-input border-2 border-primary text-foreground placeholder:text-muted-foreground glow-border"
        />

        <Button
          onClick={handleEnter}
          className="w-full h-16 text-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          ENTER
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-muted-foreground text-sm">OR</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <Button
          onClick={handleCrypticHunt}
          variant="outline"
          className="w-full h-16 text-xl border-2 border-primary bg-transparent hover:bg-primary/10 text-foreground glow-border"
        >
          Start cryptic hunt
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
