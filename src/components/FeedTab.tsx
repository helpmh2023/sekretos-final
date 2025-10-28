import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Interface now reflects the structure of the VIEW
interface MessageFromView {
  id: string;
  content: string;
  created_at: string;
  expires_at: string;
  sender_id: string;
  // Columns directly from the joined profiles table
  codename: string | null; // Make potentially null if profile might not exist
  agent_id: string | null; // Make potentially null
}

// Keep a similar internal structure for easier use in JSX if preferred
interface DisplayMessage {
   id: string;
   content: string;
   created_at: string;
   expires_at: string;
   sender_id: string;
   profiles: { // Reconstruct this object after fetching
     codename: string;
     agent_id: string;
   } | null;
 }


const FeedTab = () => {
  const [message, setMessage] = useState("");
  // State now uses the DisplayMessage structure
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();

    // Set up realtime subscription - LISTEN TO THE ORIGINAL TABLE
    const channel: RealtimeChannel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Or '*' for all changes
          schema: 'public',
          table: 'messages' // <-- Listen for changes on the BASE TABLE
        },
        (payload) => {
          // When a change happens on the base table, reload data FROM THE VIEW
          loadMessages();
        }
      )
       .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages' // <-- Listen for deletes on the BASE TABLE
        },
        (payload) => {
           // Remove directly from local state using ID
           setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
        }
      )
      .subscribe();

    // Check for expired messages every 30 seconds (client-side cleanup)
    const interval = setInterval(() => {
      setMessages((prev) => prev.filter((msg) => new Date(msg.expires_at) > new Date()));
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const loadMessages = async () => {
    // Query the VIEW instead of the TABLE
    const { data, error } = await supabase
      .from('messages_with_profiles') // <--- USE THE VIEW NAME
      .select('*')                  // <--- Select all columns defined in the view
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading messages:', error);
      // Use the specific error from Supabase
      toast.error(`Failed to load messages: ${error.message}`);
    } else {
       // Map the flat data from the view to the nested DisplayMessage structure
       const formattedData: DisplayMessage[] = (data || []).map((item: MessageFromView) => ({
         id: item.id,
         content: item.content,
         created_at: item.created_at,
         expires_at: item.expires_at,
         sender_id: item.sender_id,
         profiles: item.codename && item.agent_id ? { // Check if profile data exists
           codename: item.codename,
           agent_id: item.agent_id
         } : null // Set profiles to null if codename or agent_id is missing
       }));
      setMessages(formattedData);
    }
  };

  // --- handleTransmit remains the same, as it inserts into the base 'messages' table ---
   const handleTransmit = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Authentication required");
        return;
      }

      // Insert into the base table
      const { error } = await supabase
        .from('messages') // <-- Still insert into the TABLE
        .insert({
          content: message,
          sender_id: user.id,
        });

      if (error) throw error;

      setMessage("");
      toast.success("Message transmitted"); // This toast is correct
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error("Transmission failed");
    } finally {
      setLoading(false);
    }
  };


  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return "0:00";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    // --- JSX remains largely the same, using msg.profiles?.codename etc. ---
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        EPHEMERAL TRANSMISSION CHANNEL
      </h2>
      <p className="text-muted-foreground mb-8">
        All messages self-destruct after 5 minutes. No permanent records.
      </p>

      <div className="bg-card rounded-xl p-8 md:p-12 mb-6 min-h-[300px] max-h-[500px] overflow-y-auto">
        {messages.length === 0 ? (
           <div className="text-center space-y-4 flex items-center justify-center min-h-[200px]">
           <div>
             <p className="text-2xl md:text-3xl font-semibold text-card-foreground">
               NO ACTIVE TRANSMISSIONS
             </p>
             <p className="text-lg text-card-foreground/80">
               Waiting for incoming messages...
             </p>
           </div>
         </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-card-foreground/10 rounded-lg p-4 border border-card-foreground/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-card-foreground">
                      Agent {msg.profiles?.codename || 'Unknown'}
                    </span>
                    <span className="text-xs text-card-foreground/60 ml-2">
                      [{msg.profiles?.agent_id || 'N/A'}]
                    </span>
                  </div>
                  <span className="text-xs text-destructive font-mono">
                    {getTimeRemaining(msg.expires_at)}
                  </span>
                </div>
                <p className="text-card-foreground">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

       <div className="bg-primary/10 rounded-xl p-4 glow-border">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Type encrypted message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !loading && handleTransmit()}
            disabled={loading}
            className="flex-1 bg-input border-0 h-14 text-lg"
          />
          <Button
            onClick={handleTransmit}
            disabled={loading}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 px-8 text-lg"
          >
            {loading ? "..." : "Transmit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedTab;