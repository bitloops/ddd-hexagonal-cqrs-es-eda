export type AuthMessage = {
  type: 'error' | 'success';
  message: string;
  startAt: number;
  duration: number;
};
