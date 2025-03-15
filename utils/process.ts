import axios from 'axios';

const API_BASE_URL = ' https://127f-46-197-181-219.ngrok-free.app/api';

export const TodoAPI = {
  async addTodo(todo: { user_id: number; title: string; description?: string; due_date?: string }) {
    try {
      const response = await axios.post(`${API_BASE_URL}/todos/add`, todo);
      return response.data;
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  },

  async editTodo(todo: { id: number; user_id: number; title?: string; description?: string; due_date?: string; is_completed: boolean }) {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/edit`, todo);
      return response.data;
    } catch (error) {
      console.error('Error editing todo:', error);
      throw error;
    }
  },

  async deleteTodo(id: number, user_id: number) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/todos/delete/${id}`, {
        data: { user_id }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  async listTodos(user_id: number) {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos/list/${user_id}`);
      return response.data;
    } catch (error) {
      console.error('Error listing todos:', error);
      throw error;
    }
  }
};

export const UserAPI = {
    async registerUser(username: string, email: string, password: string) {
        try {
          const response = await axios.post(`${API_BASE_URL}/users/register`, {
            username,
            email,
            password,
          });
          return response.data;
        } catch (error) {
          throw new Error(error.response?.data?.error || 'Kayıt işlemi başarısız.');
        }
      },
    
      async loginUser(email: string, password: string) {
        try {
          const response = await axios.post(`${API_BASE_URL}/users/login`, {
            email,
            password,
          });
          return response.data;
        } catch (error) {
          throw new Error(error.response?.data?.error || 'Giriş işlemi başarısız.');
        }
      },

  async deleteUser(id: number, email: string, password: string) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/delete/${id}`, {
        data: { email, password }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async updateUsername(id: number, email: string, newUsername: string) {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/update-username`, {
        id,
        email,
        newUsername
      });
      return response.data;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  },

  async updatePassword(id: number, email: string, oldPassword: string, newPassword: string) {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/update-password`, {
        id,
        email,
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
};
