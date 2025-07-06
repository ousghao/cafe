import { 
  LayoutDashboard, 
  Utensils, 
  Calendar, 
  Package, 
  MessageSquare, 
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  userRole: string;
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    roles: ['admin', 'manager', 'viewer']
  },
  {
    id: 'menu',
    label: 'Menu',
    icon: Utensils,
    roles: ['admin', 'manager']
  },
  {
    id: 'reservations',
    label: 'Réservations',
    icon: Calendar,
    roles: ['admin', 'manager', 'viewer']
  },
  {
    id: 'orders',
    label: 'Commandes',
    icon: Package,
    roles: ['admin', 'manager', 'viewer']
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    roles: ['admin', 'manager', 'viewer']
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    roles: ['admin']
  }
];

export default function AdminSidebar({ 
  currentPage, 
  onPageChange, 
  userRole, 
  isOpen, 
  onClose 
}: AdminSidebarProps) {
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-teal">
              Assouan Fès
            </h2>
            <p className="text-sm text-gray-500">Administration</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive ? "bg-teal text-white" : "hover:bg-gray-100"
                  )}
                  onClick={() => {
                    onPageChange(item.id);
                    onClose(); // Fermer la sidebar sur mobile
                  }}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-gray-500">
              Rôle: {userRole === 'admin' ? 'Administrateur' : 
                     userRole === 'manager' ? 'Gestionnaire' : 'Lecteur'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 