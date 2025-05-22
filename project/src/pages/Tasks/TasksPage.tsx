import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import TaskItem from '../../components/tasks/TaskItem';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import useDataStore from '../../store/dataStore';
import useAuthStore from '../../store/authStore';
import { TaskStatus } from '../../types';
import AddTaskModal from '../../components/tasks/AddTaskModal';

const TasksPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    tasks,
    fetchTasks,
    updateTaskStatus,
    deleteTask,
  } = useDataStore();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'status' | 'title'>('title');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks
    .filter((task) => {
      if (filterStatus === 'all') return true;
      return task.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        return a.status.localeCompare(b.status);
      }
    });

  const handleStatusChange = (id: string, status: TaskStatus) => {
    updateTaskStatus(id, status);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const getStatusCount = (status: string) => {
    return status === 'all'
      ? tasks.length
      : tasks.filter((task) => task.status === status).length;
  };

  return (
    <div className="text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-500 dark:text-blue-400">Tasks</h1>
        {isAdmin && (
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon size={16} className="mr-1" />
            Add New Task
          </Button>
        )}
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'in_progress', 'completed'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status.replace('_', ' ').toUpperCase()} ({getStatusCount(status)})
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <label className="text-sm text-gray-900 dark:text-white">Sort by:</label>
          <select
            className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'status' | 'title')}
          >
            <option value="title">Name</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="p-4 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{task.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Assigned to: {task.assignedTo}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: <span className="capitalize">{task.status}</span>
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setEditTaskId(task.id);
                        setIsAddModalOpen(true);
                      }}
                    >
                      <PencilIcon size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeleteClick(task.id)}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="bordered" className="p-8 text-center bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No Tasks Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filterStatus !== 'all'
              ? `There are no ${filterStatus} tasks.`
              : 'There are no tasks available.'}
          </p>
        </Card>
      )}

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditTaskId(null);
        }}
        taskId={editTaskId}
      />
    </div>
  );
};

export default TasksPage;
