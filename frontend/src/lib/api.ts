const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function toCamel(s: string): string {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

function isObject(o: any): boolean {
  return o === Object(o) && !Array.isArray(o) && typeof o !== 'function';
}

export function keysToCamel(o: any): any {
  if (isObject(o)) {
    const n: Record<string, any> = {};
    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });
    return n;
  } else if (Array.isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }
  return o;
}

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();
  return keysToCamel(data);
}

export const api = {
  auth: {
    login: async (credentials: any) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
      return res;
    },
    register: async (userData: any) => {
      return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    getUsers: async () => {
      return request('/auth/users');
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  patients: {
    getAll: async () => {
      return request('/patients');
    },
    create: async (patientData: any) => {
      return request('/patients', {
        method: 'POST',
        body: JSON.stringify(patientData),
      });
    }
  },
  mlef: {
    getAll: async () => {
      return request('/mlef');
    },
    getById: async (id: string) => {
      return request(`/mlef/${id}`);
    },
    save: async (formData: any) => {
      return request('/mlef', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    }
  },
  mlr: {
    getAll: async () => {
      return request('/mlr');
    },
    getById: async (id: string) => {
      return request(`/mlr/${id}`);
    },
    save: async (reportData: any) => {
      return request('/mlr', {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
    }
  },
  pmr: {
    getAll: async () => {
      return request('/pmr');
    },
    getById: async (id: string) => {
      return request(`/pmr/${id}`);
    },
    save: async (reportData: any) => {
      return request('/pmr', {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
    }
  },
  lab: {
    getAll: async () => {
      return request('/lab');
    },
    getById: async (id: string) => {
      return request(`/lab/${id}`);
    },
    create: async (requestData: any) => {
      return request('/lab', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
    },
    update: async (id: string, updateData: any) => {
      return request(`/lab/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    }
  }
};
