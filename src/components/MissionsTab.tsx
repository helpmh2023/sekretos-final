import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const missions = [
  {
    id: 1,
    difficulty: "EASY",
    title: "Decode the First Message",
    description: "Uncover the hidden meaning in the cryptic transmission",
    reward: 100,
  },
  {
    id: 2,
    difficulty: "MEDIUM",
    title: "Infiltrate the Network",
    description: "Establish secure connection to the inner circle",
    reward: 250,
  },
  {
    id: 3,
    difficulty: "EASY",
    title: "Gather Intelligence",
    description: "Collect data from three different sources",
    reward: 150,
  },
];

const leaderboard = [
  { rank: 1, name: "Cipher", score: 1950 },
  { rank: 2, name: "Raven", score: 1750 },
  { rank: 3, name: "Mimi", score: 1660 },
  { rank: 4, name: "Zino", score: 1250 },
  { rank: 5, name: "Codewarior", score: 1150 },
  { rank: 6, name: "Bammer", score: 1100 },
  { rank: 7, name: "Reyna", score: 900 },
];

const milestones = [
  "The First Bloom – initiation of the first successful operation; the circle breathes. [+100]",
  "Eyes Open – establishing awareness and observation networks unseen by the world. [+150]",
  "Whispers Heard – decoding and exchanging the first true ciphered message.[+200]",
  "The Silent Handshake – linking two Sekretos cells without public trace.[+250]",
  "Cipher Lock – securing encrypted communication systems from intrusion. [+300]",
  "Under the Rose – executing a covert task that remains unspoken. [+350]",
  "Echo of Sekretos – imprinting the movement's unseen presence across channels.[+500]",
];

const MissionsTab = () => {
  const [activeTab, setActiveTab] = useState("missions");
  const navigate = useNavigate();

  const handleMissionStart = (missionId: number) => {
    navigate(`/mission/${missionId}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-popover rounded-xl p-6 glow-border text-center">
          <p className="text-sm text-muted-foreground mb-2">TOTAL</p>
          <p className="text-4xl font-bold">6</p>
        </div>
        <div className="bg-popover rounded-xl p-6 glow-border text-center">
          <p className="text-sm text-muted-foreground mb-2">COMPLETED</p>
          <p className="text-4xl font-bold">0</p>
        </div>
        <div className="bg-popover rounded-xl p-6 glow-border text-center">
          <p className="text-sm text-muted-foreground mb-2">ACTIVE</p>
          <p className="text-4xl font-bold">6</p>
        </div>
        <div className="bg-popover rounded-xl p-6 glow-border text-center">
          <p className="text-sm text-muted-foreground mb-2">COMPLETION</p>
          <p className="text-4xl font-bold">0%</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2 mb-8">
          <TabsTrigger
            value="missions"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground bg-primary text-primary-foreground border-2 border-primary"
          >
            MISSIONS
          </TabsTrigger>
          <TabsTrigger
            value="guide"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground bg-primary text-primary-foreground border-2 border-primary"
          >
            GUIDE
          </TabsTrigger>
          <TabsTrigger
            value="milestones"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground bg-primary text-primary-foreground border-2 border-primary"
          >
            MILESTONES
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground bg-primary text-primary-foreground border-2 border-primary"
          >
            LEADERBOARD
          </TabsTrigger>
        </TabsList>

        <TabsContent value="missions">
          <h3 className="text-2xl font-bold mb-6">Pending Missions</h3>
          <div className="space-y-4">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="bg-card-bg rounded-xl p-6 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold text-primary">
                      {mission.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-card-foreground">
                    {mission.title}
                  </h4>
                  <p className="text-sm text-card-foreground/80 mb-2">
                    {mission.description}
                  </p>
                  <p className="text-sm font-semibold text-card-foreground">
                    Reward: +{mission.reward}
                  </p>
                </div>
                <Button
                  onClick={() => handleMissionStart(mission.id)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground ml-4"
                >
                  COMPLETE
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guide">
          <div className="bg-popover rounded-xl p-8 glow-border">
            <h3 className="text-2xl font-bold mb-6">Mission Guide</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                • Complete missions to increase your rank and influence within Sekretos
              </p>
              <p>• Each mission has a difficulty rating and reward points</p>
              <p>• Higher difficulty missions yield greater rewards</p>
              <p>
                • Track your progress through milestones to unlock special achievements
              </p>
              <p>• Compete on the leaderboard against other agents</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="milestones">
          <div className="bg-card-bg rounded-xl p-8">
            <div className="space-y-3 text-card-foreground">
              {milestones.map((milestone, index) => (
                <p key={index} className="text-sm leading-relaxed">
                  {milestone}
                </p>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="bg-card-bg rounded-xl p-8">
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center justify-between py-3 border-b border-card-foreground/10 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-card-foreground w-8">
                      {entry.rank}
                    </span>
                    <span className="text-lg text-card-foreground">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-card-foreground">
                    {entry.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MissionsTab;
