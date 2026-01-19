import { signal } from '@angular/core';
export const userStore = signal({
  name: '',
  email: '',
  password: '',
});

export const addUser = ({ name, email, password }: any) => {
  userStore.set({ name, email, password });
};

export const removeUser = () => {
  userStore.set({ name: '', email: '', password: '' });
};
