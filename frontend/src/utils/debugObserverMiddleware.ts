import { type Middleware } from '@reduxjs/toolkit';

export const debugObserverMiddleware: Middleware = store => next => (action) => {
    const prevState = store.getState();
    const result = next(action);
    const nextState = store.getState();

    if (prevState !== nextState) {
        console.debug('Redux state changed due to action:', (action as { type: string }).type);
        console.debug('Previous state:', prevState);
        console.debug('Next state:', nextState);
    }

    return result;
};