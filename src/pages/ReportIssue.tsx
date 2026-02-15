import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload } from "lucide-react";

const ISSUE_TYPES = [
  "Road Damage",
  "Garbage Problem",
  "Water Leakage",
  "Street Light Failure",
];

const ReportIssue = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [issueType, setIssueType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let photoUrl: string | null = null;

      if (photo) {
        const fileExt = photo.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("issue-photos")
          .upload(filePath, photo);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("issue-photos")
          .getPublicUrl(filePath);
        photoUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("issues").insert({
        issue_type: issueType,
        location,
        description,
        photo_url: photoUrl,
        created_by: user.id,
      });

      if (error) throw error;

      toast({ title: "Issue Reported!", description: "Your civic issue has been submitted successfully." });
      navigate("/reports");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Report a Civic Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Type of Issue</Label>
                <Select required value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ISSUE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. 5th Avenue & Main St" required value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the issue in detail..." rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Photo (optional)</Label>
                <div className="flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input bg-secondary/50 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary">
                    <Upload className="h-4 w-4" />
                    {photo ? photo.name : "Upload a photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !issueType}>
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;
