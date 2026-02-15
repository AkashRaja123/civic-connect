import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, BarChart3, LogOut, TreePine } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Report Issue",
      description: "Submit a new civic issue in your area",
      icon: AlertTriangle,
      path: "/report",
      color: "text-destructive",
    },
    {
      title: "View Reports",
      description: "Browse all submitted issue reports",
      icon: FileText,
      path: "/reports",
      color: "text-info",
    },
    {
      title: "Progress",
      description: "Track resolution status of issues",
      icon: BarChart3,
      path: "/progress",
      color: "text-success",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <TreePine className="h-7 w-7 text-primary-foreground" />
            <h1 className="font-heading text-xl font-bold text-primary-foreground">CivicReport</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-primary-foreground/80 sm:inline">
              {user?.email}
            </span>
            <Button variant="secondary" size="sm" onClick={() => { signOut(); navigate("/auth"); }}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h2 className="font-heading text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="mt-2 text-muted-foreground">Report civic issues and track their resolution in your community.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <Card
              key={card.path}
              className="group cursor-pointer shadow-card border-0 transition-all hover:shadow-elevated hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => navigate(card.path)}
            >
              <CardHeader>
                <div className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <CardTitle className="font-heading text-xl">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary group-hover:underline">
                  Go to {card.title} →
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
