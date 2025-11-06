import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
  Modal,
  Input,
  Alert
} from '@/components/common';
import { useTeamStore } from '@/store/teamStore';
import {
  Plus,
  Users,
  Settings,
  Mail,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const Teams: React.FC = () => {
  const { teams, isLoading, fetchTeams, createTeam } = useTeamStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error('Team name is required');
      return;
    }

    try {
      setIsCreating(true);
      await createTeam({
        name: teamName,
        description: teamDescription,
      });
      toast.success('Team created successfully');
      setIsCreateModalOpen(false);
      setTeamName('');
      setTeamDescription('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading && !teams.length) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loading size="lg" text="Loading teams..." />
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
            <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
            <p className="text-gray-600 mt-1">Collaborate with your team members</p>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Create Team
          </Button>
        </div>

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first team to start collaborating
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>Create Team</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team._id} variant="elevated" hoverable>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {team.members?.length || 0} members
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {team.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  {/* Team Members Preview */}
                  {team.members && team.members.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Members</p>
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 5).map((_member, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center"
                            title={`Member ${index + 1}`}
                          >
                            <span className="text-xs font-medium text-primary-600">
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>
                        ))}
                        {team.members.length > 5 && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              +{team.members.length - 5}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Team Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Projects</p>
                      <p className="text-lg font-semibold text-gray-900">0</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Tasks</p>
                      <p className="text-lg font-semibold text-gray-900">0</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Team Invitations Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No pending invitations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setTeamName('');
          setTeamDescription('');
        }}
        title="Create New Team"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Team Name"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Enter team description"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
            />
          </div>

          <Alert
            type="info"
            message="You will be the owner of this team and can invite members after creation."
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setTeamName('');
                setTeamDescription('');
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTeam} isLoading={isCreating} disabled={isCreating}>
              Create Team
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Teams;

