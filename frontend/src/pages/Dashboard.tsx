import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { KanbanBoard } from '@/components/kanban';
import { Card, CardHeader, CardTitle, CardContent, Loading, Badge } from '@/components/common';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ListTodo,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks, stats, isLoading, fetchTasks, fetchTaskStats } = useTaskStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    fetchTasks();
    fetchTaskStats();
  }, [fetchTasks, fetchTaskStats]);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'In Progress',
      value: stats?.byStatus?.['in-progress'] || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const priorityStats = stats?.byPriority ? [
    { label: 'Urgent', value: stats.byPriority.urgent, color: 'danger' },
    { label: 'High', value: stats.byPriority.high, color: 'warning' },
    { label: 'Medium', value: stats.byPriority.medium, color: 'primary' },
    { label: 'Low', value: stats.byPriority.low, color: 'success' },
  ] : [];

  if (isLoading && !tasks.length) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loading size="lg" text="Loading dashboard..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your tasks today.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} variant="elevated" hoverable>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Priority Distribution */}
        {priorityStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {priorityStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <Badge variant={stat.color as any} size="lg" className="mb-2">
                      {stat.value}
                    </Badge>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable className="cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Today's Tasks</h3>
                  <p className="text-sm text-gray-600">View tasks due today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hoverable className="cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Team Tasks</h3>
                  <p className="text-sm text-gray-600">Collaborate with team</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hoverable className="cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-600">View detailed reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board or List View */}
        {viewMode === 'kanban' ? (
          <KanbanBoard />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Task List</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">List view coming soon...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;

