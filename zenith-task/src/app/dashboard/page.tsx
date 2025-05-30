import React from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import KpiCard from '@/components/dashboard/kpi-card';
import { CalendarCheck2, CalendarDays, Briefcase, AlertOctagon, CheckCircle2 } from 'lucide-react';
import TaskCompletionBarChart from '@/components/dashboard/charts/TaskCompletionBarChart';
import TasksOverTimeLineChart from '@/components/dashboard/charts/TasksOverTimeLineChart';

const DashboardPage: React.FC = () => {
  // TODO: Later, this array could come from user preferences or a default config
  const widgetLayout = [
    { id: 'kpiSection', type: 'kpiGroup', title: 'Key Metrics' },
    { id: 'chartSection', type: 'chartGroup', title: 'Visualizations' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">
          Hello, User Name!
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your Zenith Task dashboard. Here's an overview of your current activity:
          {/* TODO: Add a "Customize Dashboard" button here later */}
        </p>
      </div>

      {/* TODO: Implement drag-and-drop for widget reordering of these sections */}
      {widgetLayout.map((section) => (
        <section key={section.id} aria-labelledby={section.id + '-title'} className="mb-12">
          {/* This title could be hidden or part of a draggable section header later */}
          {/* <h2 id={section.id + '-title'} className="text-2xl font-semibold text-foreground mb-6">{section.title}</h2> */}
          
          {section.type === 'kpiGroup' && (
            // {/* Widget area: KPIs - Future: Allow user to select which KPIs to display & reorder */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Static KPI widgets for now. Later, these would be dynamically rendered based on user config. */}
              <KpiCard
                title="Tasks Due Today"
                value="5"
                icon={CalendarCheck2}
                iconColor="text-blue-400"
              />
              <KpiCard
                title="Tasks This Week"
                value="25"
                icon={CalendarDays}
                iconColor="text-sky-400"
              />
              <KpiCard
                title="Projects In Progress"
                value="3"
                icon={Briefcase}
                iconColor="text-purple-400"
              />
              <KpiCard
                title="Overdue Tasks"
                value="2"
                icon={AlertOctagon}
                iconColor="text-red-400"
                valueColor="text-red-400"
                trend="-1 from yesterday"
                trendColor="text-red-500"
              />
              <KpiCard
                title="Completion Rate"
                value="78%"
                icon={CheckCircle2}
                iconColor="text-green-400"
                valueColor="text-green-400"
                trend="+2% this week"
                trendColor="text-green-500"
              />
              {/* TODO: Add a "+" button or similar to add more KPI widgets */}
            </div>
          )}

          {section.type === 'chartGroup' && (
            // {/* Widget area: Charts - Future: Allow user to add/remove/reorder charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Static chart widgets for now. */}
              <TaskCompletionBarChart />
              <TasksOverTimeLineChart />
              {/* TODO: Add a "+" button or similar to add more chart widgets */}
            </div>
          )}
        </section>
      ))}
      
      {/* Further dashboard sections or a dedicated area for "available widgets" could be added below */}
    </DashboardLayout>
  );
};

export default DashboardPage;
