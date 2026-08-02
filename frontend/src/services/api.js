import axios from 'axios';

// Use Vite's local proxy during web development, or a deployed HTTPS backend
// in Android/iOS builds (set VITE_API_BASE_URL in the build environment).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // 5 second timeout to prevent hanging
});

// Interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize Django REST Framework paginated list responses.
//
// The UI consumes list endpoints as arrays (for example, `todos.map(...)`),
// while DRF wraps paginated responses in `{ count, next, previous, results }`.
// Without unwrapping, the page renders its loader first and then crashes as
// soon as the API response arrives because `.map` is called on an object.
const unwrapPaginatedResponse = (response) => {
  if (Array.isArray(response?.data?.results)) {
    response.data = response.data.results;
  }
  return response;
};

// Interceptor to normalize list responses and handle token refresh
api.interceptors.response.use(
  unwrapPaginatedResponse,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
  refreshToken: (refresh) => api.post('/auth/token/refresh/', { refresh }),
};

// Dashboard APIs
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview/'),
  getScores: () => api.get('/dashboard/scores/'),
  getQuotes: () => api.get('/dashboard/quotes/'),
};

// Planner APIs
export const plannerAPI = {
  getTodos: (params) => api.get('/planner/todos/', { params }),
  createTodo: (data) => api.post('/planner/todos/', data),
  updateTodo: (id, data) => api.patch(`/planner/todos/${id}/`, data),
  deleteTodo: (id) => api.delete(`/planner/todos/${id}/`),
  getCategories: () => api.get('/planner/categories/'),
  createCategory: (data) => api.post('/planner/categories/', data),
};

// Study APIs
export const studyAPI = {
  getSubjects: () => api.get('/study/subjects/'),
  createSubject: (data) => api.post('/study/subjects/', data),
  updateSubject: (id, data) => api.patch(`/study/subjects/${id}/`, data),
  deleteSubject: (id) => api.delete(`/study/subjects/${id}/`),
  getSessions: (params) => api.get('/study/sessions/', { params }),
  createSession: (data) => api.post('/study/sessions/', data),
};

// Project APIs
export const projectAPI = {
  getProjects: () => api.get('/projects/projects/'),
  createProject: (data) => api.post('/projects/projects/', data),
  updateProject: (id, data) => api.patch(`/projects/projects/${id}/`, data),
  deleteProject: (id) => api.delete(`/projects/projects/${id}/`),
  getChecklist: () => api.get('/projects/checklist/'),
  createChecklist: (data) => api.post('/projects/checklist/', data),
  updateChecklist: (id, data) => api.patch(`/projects/checklist/${id}/`, data),
};

// Expense APIs
export const expenseAPI = {
  getExpenses: (params) => api.get('/expenses/expenses/', { params }),
  createExpense: (data) => api.post('/expenses/expenses/', data),
  updateExpense: (id, data) => api.patch(`/expenses/expenses/${id}/`, data),
  deleteExpense: (id) => api.delete(`/expenses/expenses/${id}/`),
  getCategories: () => api.get('/expenses/categories/'),
  createCategory: (data) => api.post('/expenses/categories/', data),
  getIncomes: (params) => api.get('/expenses/incomes/', { params }),
  createIncome: (data) => api.post('/expenses/incomes/', data),
  getSavings: () => api.get('/expenses/savings/'),
  createSavings: (data) => api.post('/expenses/savings/', data),
};

// Fitness APIs
export const fitnessAPI = {
  getLogs: (params) => api.get('/fitness/logs/', { params }),
  createLog: (data) => api.post('/fitness/logs/', data),
  updateLog: (id, data) => api.patch(`/fitness/logs/${id}/`, data),
};

// Habit APIs
export const habitAPI = {
  getHabits: () => api.get('/habits/habits/'),
  createHabit: (data) => api.post('/habits/habits/', data),
  updateHabit: (id, data) => api.patch(`/habits/habits/${id}/`, data),
  deleteHabit: (id) => api.delete(`/habits/habits/${id}/`),
  getLogs: (params) => api.get('/habits/logs/', { params }),
  createLog: (data) => api.post('/habits/logs/', data),
  updateLog: (id, data) => api.patch(`/habits/logs/${id}/`, data),
};

// Recovery APIs
export const recoveryAPI = {
  getLogs: (params) => api.get('/recovery/logs/', { params }),
  createLog: (data) => api.post('/recovery/logs/', data),
  updateLog: (id, data) => api.patch(`/recovery/logs/${id}/`, data),
  getMilestones: () => api.get('/recovery/milestones/'),
};

// Goal APIs
export const goalAPI = {
  getGoals: () => api.get('/goals/goals/'),
  createGoal: (data) => api.post('/goals/goals/', data),
  updateGoal: (id, data) => api.patch(`/goals/goals/${id}/`, data),
  deleteGoal: (id) => api.delete(`/goals/goals/${id}/`),
  getProgress: () => api.get('/goals/progress/'),
  createProgress: (data) => api.post('/goals/progress/', data),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => api.get('/notifications/notifications/'),
  markAllRead: () => api.post('/notifications/notifications/mark_all_read/'),
  getPreferences: () => api.get('/notifications/preferences/'),
  updatePreferences: (data) => api.patch('/notifications/preferences/settings/', data),
};

// Analytics APIs
export const analyticsAPI = {
  getData: () => api.get('/analytics/data/'),
  getSnapshots: () => api.get('/analytics/snapshots/'),
};

// AI APIs
export const aiAPI = {
  getInsights: () => api.get('/ai/insights/'),
  getChat: () => api.get('/ai/chat/'),
  sendMessage: (data) => api.post('/ai/chat/', data),
};

export default api;
