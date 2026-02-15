import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock } from "lucide-react";

interface Issue {
  id: string;
  issue_type: string;
  location: string;
  description: string;
  status: string;
  photo_url: string | null;
  created_at: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case "Pending": return "bg-warning/15 text-warning border-warning/30";
    case "In Progress": return "bg-info/15 text-info border-info/30";
    case "Completed": return "bg-success/15 text-success border-success/30";
    default: return "bg-muted text-muted-foreground";
  }
};

const ViewReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchIssues = async () => {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setIssues(data as Issue[]);
      setLoading(false);
    };
    fetchIssues();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <h1 className="font-heading mb-8 text-2xl font-bold text-foreground">Submitted Reports</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading reports...</p>
        ) : issues.length === 0 ? (
          <Card className="border-0 shadow-card">
            <CardContent className="py-12 text-center text-muted-foreground">
              No issues reported yet. Be the first to report one!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue, i) => (
              <Card key={issue.id} className="border-0 shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                {issue.photo_url && (
                  <img src={issue.photo_url} alt={issue.issue_type} className="h-40 w-full object-cover" />
                )}
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-semibold text-foreground">{issue.issue_type}</h3>
                    <Badge variant="outline" className={statusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {issue.location}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(issue.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReports;
