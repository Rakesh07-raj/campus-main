import { signal } from '@angular/core';
export const userStore = signal({
  id: '',
  name: '',
  email: '',
  role: '',
});

export const addUser = ({ id, name, email, role }: any) => {
  userStore.set({ id, name, email, role });
};

export const removeUser = () => {
  userStore.set({ id: '', name: '', email: '', role: '' });
};
