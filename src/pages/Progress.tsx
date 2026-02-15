import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Circle } from "lucide-react";

interface Issue {
  id: string;
  issue_type: string;
  location: string;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; dotClass: string; badgeClass: string }> = {
  Pending: {
    label: "Pending",
    dotClass: "bg-warning",
    badgeClass: "bg-warning/15 text-warning border-warning/30",
  },
  "In Progress": {
    label: "In Progress",
    dotClass: "bg-info",
    badgeClass: "bg-info/15 text-info border-info/30",
  },
  Completed: {
    label: "Completed",
    dotClass: "bg-success",
    badgeClass: "bg-success/15 text-success border-success/30",
  },
};

const Progress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchIssues = async () => {
      const { data, error } = await supabase
        .from("issues")
        .select("id, issue_type, location, status, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) setIssues(data as Issue[]);
      setLoading(false);
    };
    fetchIssues();
  }, [user]);

  const grouped = {
    Pending: issues.filter((i) => i.status === "Pending"),
    "In Progress": issues.filter((i) => i.status === "In Progress"),
    Completed: issues.filter((i) => i.status === "Completed"),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <h1 className="font-heading mb-8 text-2xl font-bold text-foreground">Issue Progress</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {(Object.entries(grouped) as [string, Issue[]][]).map(([status, items]) => {
              const config = statusConfig[status];
              return (
                <Card key={status} className="border-0 shadow-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${config.dotClass}`} />
                      <CardTitle className="font-heading text-lg">{config.label}</CardTitle>
                      <Badge variant="secondary" className="ml-auto">{items.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">No issues</p>
                    ) : (
                      items.map((issue) => (
                        <div key={issue.id} className="rounded-lg border bg-secondary/30 p-3 space-y-1">
                          <p className="font-medium text-sm text-foreground">{issue.issue_type}</p>
                          <p className="text-xs text-muted-foreground">{issue.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(issue.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
