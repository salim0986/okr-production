import { useUserStore } from "@/stores/userStore";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeamLeadDashboard } from "@/components/dashboard/TeamLeadDashboard";
import { EmployeeDashboard } from "@/components/dashboard/EmployeeDashboard";

const Dashboard = () => {
  const { userRole } = useUserStore();

  const renderDashboard = () => {
    switch (userRole) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Team Lead':
        return <TeamLeadDashboard />;
      case 'Employee':
        return <EmployeeDashboard />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your {userRole.toLowerCase()} overview.
          </p>
        </div>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;