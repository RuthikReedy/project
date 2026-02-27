import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Activity, HeartPulse, ShieldCheck, ArrowRight, Upload } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md fixed w-full z-50 border-b">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">Vision Diagnostics AI</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate("/auth")}>Login</Button>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col pt-32 pb-16 px-6 lg:px-8 bg-gradient-to-b from-background to-sidebar">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Offline-first architecture
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Medical Imaging</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload scans and receive instantaneous, secure, edge-processed diagnostic intelligence.
            Designed for healthcare professionals managing X-Rays, MRIs, and CT Scans.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Button size="lg" className="h-14 px-8 text-lg" onClick={() => navigate("/auth")}>
              Try Demo Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-background" onClick={() => navigate("/auth")}>
              View Features
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-32">
          <div className="p-6 rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-lg bg-blue-100/50 flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Analysis</h3>
            <p className="text-muted-foreground">Upload any medical scan and get AI-powered insights instantly directly in your browser without heavy cloud requests.</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Patient Tracking</h3>
            <p className="text-muted-foreground">Maintain a comprehensive dashboard of patient histories and dynamic diagnostic statistics over time.</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-lg bg-green-100/50 flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
            <p className="text-muted-foreground">Powered by Local Storage mocks. No patient data leaves your system while testing, ensuring strict HIPAA compliance.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          Built with <HeartPulse className="h-4 w-4 text-red-500" /> for medical professionals
        </p>
      </footer>
    </div>
  );
};

export default Index;
