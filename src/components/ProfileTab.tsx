import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  codename: string;
  agent_id: string;
  rank_tier: string;
  rank_progress: number;
  missions_completed: number;
  joined_at: string;
}

const ProfileTab = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
    } else {
      setProfile(data);
    }
  };

  if (!profile) {
    return <div className="text-center">Loading agent profile...</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-8">Agent Profile</h2>

      <div className="bg-popover rounded-xl p-8 glow-border">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-sm text-muted-foreground mb-2">CODENAME</p>
            <p className="text-3xl font-bold text-primary">{profile.codename}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">RANK TIER</p>
            <p className="text-3xl font-bold text-primary">{profile.rank_tier}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg">Rank progress</p>
            <p className="text-lg font-semibold">{profile.rank_progress}/100</p>
          </div>
          <Progress value={profile.rank_progress} className="h-3" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Missions Completed</p>
            <p className="text-5xl font-bold">{profile.missions_completed}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Agent Id</p>
            <p className="text-2xl font-mono">{profile.agent_id}</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Joined</p>
          <p className="text-xl">{formatDate(profile.joined_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
