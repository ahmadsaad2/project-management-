import React, { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import ProjectCard from '../../components/projects/ProjectCard';
import AddProjectModal from '../../components/projects/AddProjectModal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import useDataStore from '../../store/dataStore';
import useAuthStore from '../../store/authStore';

const ProjectsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { projects, fetchProjects } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'All Statuses' ||
      (selectedStatus === 'Completed' && project.progress === 100) ||
      (selectedStatus === 'In Progress' && project.progress > 0 && project.progress < 100) ||
      (selectedStatus === 'Not Started' && project.progress === 0);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-500 dark:text-blue-400">Projects</h1>
        {user?.role === 'admin' && (
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon size={16} className="mr-1" />
            Add Project
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon size={18} className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-10 pr-4 text-black dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-gray-200 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2"
        >
          <option>All Statuses</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Not Started</option>
        </select>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold">No projects found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting filters or add a new project.</p>
        </Card>
      )}

      <AddProjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default ProjectsPage;
