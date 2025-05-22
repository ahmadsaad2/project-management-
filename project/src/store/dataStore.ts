// ✅ dataStore.ts with Projects, Tasks, and Chat Support + Dark Theme Ready

import { create } from 'zustand';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  start_date: string;
  end_date: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  projectId: string;
  dueDate: string;
}

interface DirectChat {
  id: string;
  other_user: string;
}

interface DirectMessage {
  id: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp: string;
}

interface DashboardStats {
  projectCount: number;
  studentCount: number;
  taskCount: number;
  finishedCount: number;
}

interface DataStore {
  // Projects
  projects: Project[];
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Tasks
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;

  // Chat
  directChats: DirectChat[];
  messages: DirectMessage[];
  fetchDirectChats: () => Promise<void>;
  fetchChatMessages: (chatId: string) => Promise<void>;
  sendDirectMessage: (params: { chatId: string; content: string }) => Promise<void>;

  // Dashboard
  dashboard: DashboardStats;
  fetchDashboardData: () => Promise<void>;
}

const API_BASE = 'http://localhost:5000/api';

const useDataStore = create<DataStore>((set, get) => ({
  projects: [],
  tasks: [],
  directChats: [],
  messages: [],
  dashboard: {
    projectCount: 0,
    studentCount: 0,
    taskCount: 0,
    finishedCount: 0,
  },

  // Projects
  fetchProjects: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    set({ projects: Array.isArray(data) ? data : [] });
  },

  createProject: async (data) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    get().fetchProjects();
  },

  updateProject: async (id, data) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    get().fetchProjects();
  },

  deleteProject: async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    get().fetchProjects();
  },

  // Tasks
  fetchTasks: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    set({ tasks: Array.isArray(data) ? data : [] });
  },

  createTask: async (data) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    get().fetchTasks();
  },

  updateTask: async (id, data) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    get().fetchTasks();
  },

  deleteTask: async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    get().fetchTasks();
  },

  updateTaskStatus: async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    get().fetchTasks();
  },

  // Chat
  fetchDirectChats: async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/direct-chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      set({ directChats: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error('Failed to fetch direct chats:', error);
    }
  },

  fetchChatMessages: async (chatId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/direct-chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      set({ messages: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  },

  sendDirectMessage: async ({ chatId, content }) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE}/direct-chats/${chatId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      get().fetchChatMessages(chatId);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },

  // Dashboard
  fetchDashboardData: async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      set({ dashboard: data });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  }
}));

export default useDataStore;
