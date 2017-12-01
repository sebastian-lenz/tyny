const setIdleCallback: (callback: Function) => void =
  'requestIdleCallback' in window
    ? (<any>window)['requestIdleCallback']
    : (callback: Function) => setTimeout(callback, 0);

export default setIdleCallback;
