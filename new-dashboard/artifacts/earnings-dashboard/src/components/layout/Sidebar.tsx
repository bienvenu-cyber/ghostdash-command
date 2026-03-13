import { Link, useLocation } from "wouter";
import {
  Home, Bell, MessageSquare, Grid, Lock,
  Clock, FileText, BarChart2, User, MoreHorizontal, Camera
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/my/statistics/statements/earnings", disabled: false },
  { icon: Bell, label: "Notifications", href: "/my/notifications", disabled: true },
  { icon: MessageSquare, label: "Messages", href: "/my/chats", disabled: true },
  { icon: Grid, label: "Collections", href: "/my/collections/user-lists/subscribers/active", disabled: true },
  { icon: Lock, label: "Vault", href: "/my/vault/list/all", disabled: true },
  { icon: Clock, label: "Queue", href: "/my/queue", disabled: true },
  { icon: FileText, label: "Statements", href: "/my/statements/earnings", disabled: false },
  { icon: BarChart2, label: "Statistics", href: "/my/statistics/statements/earnings", disabled: false },
  { icon: User, label: "My profile", href: "/my/profile", disabled: true },
  { icon: MoreHorizontal, label: "More", href: "/my/more", disabled: true },
];

export function Sidebar() {
  const [location] = useLocation();
  const { state, updateState, setAllTimeEarningsFormOpen } = useAppContext();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateState({ avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const isActive = (href: string) => {
    if (href === '/my/statistics/statements/earnings' || href === '/my/statistics/overview/earnings') {
      return location.startsWith('/my/statistics') || location === '/';
    }
    if (href === '/my/statements/earnings') {
      return location.startsWith('/my/statements');
    }
    return location === href;
  };

  return (
    <div className={cn(
      "w-[230px] flex-shrink-0 h-full border-r flex flex-col z-10 relative hidden md:flex transition-colors",
      state.theme === 'dark'
        ? "bg-white dark:bg-[#0a0a0a] border-[#e5e5e5] dark:border-[#333]"
        : "bg-white border-gray-200"
    )}>
      <div className="p-4 flex flex-col gap-2">
        <label className="relative cursor-pointer group mb-2 ml-2 block w-[42px] h-[42px]">
          <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-blue-100 flex items-center justify-center relative">
            {state.avatar ? (
              <img src={state.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#00AFF0] text-white flex items-center justify-center text-lg font-bold">U</div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </label>

        <nav className="flex flex-col">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={(e) => {
                  if (!item.disabled) {
                    window.location.href = item.href;
                  }
                }}
                className={cn(
                  "py-3 px-4 flex items-center justify-between group cursor-pointer transition-colors rounded-lg",
                  active
                    ? state.theme === 'dark'
                      ? "text-[hsl(var(--foreground))] dark:text-white font-bold"
                      : "text-[hsl(var(--foreground))] font-bold"
                    : state.theme === 'dark'
                      ? "text-[#666666] dark:text-[#999] hover:text-[hsl(var(--foreground))] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                      : "text-gray-600 hover:text-[hsl(var(--foreground))] hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-5 h-5" strokeWidth={active ? 2 : 1.5} />
                  <span className="text-[15px]">{item.label}</span>
                </div>
                {item.label === 'Notifications' && state.notificationsCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {state.notificationsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 pb-6">
        <button
          onClick={() => setAllTimeEarningsFormOpen(true)}
          className="w-full bg-[#00AFF0] hover:bg-[#0099D6] text-white rounded-full py-2.5 font-bold text-[14px] transition-colors shadow-sm"
        >
          + NEW POST
        </button>
      </div>
    </div>
  );
}
