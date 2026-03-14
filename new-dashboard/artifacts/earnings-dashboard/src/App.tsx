import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import ChartEditForm from "@/components/ChartEditForm";
import AllTimeEarningsForm from "@/components/AllTimeEarningsForm";
import BalanceEditForm from "@/components/BalanceEditForm";
import LoadingScreen from "@/components/LoadingScreen";
import LoginModal from "@/components/LoginModal";
import WelcomeScreen from "@/components/WelcomeScreen";
import Statistics from "@/pages/Statistics";
import Statements from "@/pages/Statements";
import { AppProvider, useAppContext } from "@/context/AppContext";

const queryClient = new QueryClient();

function Router() {
  const { state, isLoading, isAuthenticated, setIsAuthenticated, loginDate, setLoginDate, showWelcome, setShowWelcome } = useAppContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <LoginModal
        open={true}
        onSuccess={() => {
          setIsAuthenticated(true);
          setLoginDate(new Date().toISOString());
          setShowWelcome(false); // Skip welcome for new login
        }}
      />
    );
  }

  if (showWelcome && loginDate) {
    return <WelcomeScreen loginDate={loginDate} onContinue={() => setShowWelcome(false)} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-background transition-colors">
      <Sidebar />
      <div className="flex-1 h-full overflow-hidden">
        <Switch>
          {/* Statements - must come BEFORE statistics to avoid conflicts */}
          <Route path="/my/statements/:sub" component={Statements} />
          <Route path="/my/statements" component={Statements} />
          {/* Statistics nested routes */}
          <Route path="/my/statistics/:tab/:sub" component={Statistics} />
          <Route path="/my/statistics/:tab" component={Statistics} />
          <Route path="/my/statistics" component={Statistics} />
          {/* Legacy & root redirects */}
          <Route path="/" component={Statistics} />
          <Route>
            <div className="p-8 text-foreground">404 - Not Found</div>
          </Route>
        </Switch>
      </div>
      <BottomNav />
      <ChartEditForm />
      <AllTimeEarningsForm />
      <BalanceEditForm />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
