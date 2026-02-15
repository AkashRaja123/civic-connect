import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TreePine, Shield } from "lucide-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        if (!email.includes("@")) {
          toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
          setLoading(false);
          return;
        }
        if (phone && !/^\d+$/.test(phone)) {
          toast({ title: "Invalid phone", description: "Phone number must contain only digits.", variant: "destructive" });
          setLoading(false);
          return;
        }
        await signUp(email, password, username, phone);
        toast({ title: "Account created!", description: "You can now sign in." });
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 gradient-hero opacity-5" />
      <Card className="relative w-full max-w-md shadow-elevated border-0">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero">
            <TreePine className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="font-heading text-2xl font-bold text-foreground">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSignUp ? "Join the civic reporting platform" : "Sign in to report and track civic issues"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="johndoe" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Secured civic platform</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
