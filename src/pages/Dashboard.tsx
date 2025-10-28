import { useState, useEffect } from "react"; // <-- Import useEffect
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/ProfileTab";
import FeedTab from "@/components/FeedTab";
import MissionsTab from "@/components/MissionsTab";
import { supabase } from "@/integrations/supabase/client"; // <-- Import supabase client

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [agentName, setAgentName] = useState<string>("Agent"); // <-- Add state for agent name
  const navigate = useNavigate();

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('codename')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching agent name:", error);
        } else if (data) {
          setAgentName(data.codename);
        }
      }
    };
    fetchProfile();
  }, []); // Empty dependency array ensures this runs only once on mount


  const handleLogout = async () => { // <-- Make handleLogout async
    await supabase.auth.signOut(); // <-- Sign out the user
    navigate("/");
  };

  return (
    <div className="min-h-screen atmospheric-bg">
      <div className="border-b-2 border-primary glow-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold glow-text">
              {/* Use the state variable here */}
              Welcome to Sekretos, {agentName}
            </h1>
            <Button
              onClick={handleLogout}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Logout
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-transparent gap-2">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground bg-primary text-primary-foreground border-2 border-primary glow-border"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="feed"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground bg-primary text-primary-foreground border-2 border-primary glow-border"
              >
                Feed
              </TabsTrigger>
              <TabsTrigger
                value="missions"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground bg-primary text-primary-foreground border-2 border-primary glow-border"
              >
                Missions
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="feed">
            <FeedTab />
          </TabsContent>
          <TabsContent value="missions">
            <MissionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;