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
import Statistics from "@/pages/Statistics";
import Statements from "@/pages/Statements";
import { AppProvider, useAppContext } from "@/context/AppContext";

const queryClient = new QueryClient();

function Router() {
  const { state, isLoading, isAuthenticated, setIsAuthenticated } = useAppContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginModal open={true} onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`flex flex-col md:flex-row h-screen w-full overflow-hidden transition-colors ${state.theme === 'dark' ? 'bg-[#fafafa] dark:bg-[#0f0f0f]' : 'bg-[#fafafa]'
      }`}>
      <Sidebar />
      <div className="flex-1 h-full overflow-hidden">
        <Switch>
          {/* Statistics nested routes */}
          <Route path="/my/statistics/:tab/:sub" component={Statistics} />
          <Route path="/my/statistics/:tab" component={Statistics} />
          <Route path="/my/statistics" component={Statistics} />
          {/* Statements */}
          <Route path="/my/statements/:sub" component={Statements} />
          <Route path="/my/statements" component={Statements} />
          {/* Legacy & root redirects */}
          <Route path="/" component={Statistics} />
          <Route>
            <div className={`p-8 ${state.theme === 'dark' ? 'text-white' : 'text-black'}`}>404 - Not Found</div>
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
