import './index.css';

// FLEXCUBE Neo initialization hook
if (typeof (window as any).boot === 'function' && !(window as any)._booted) {
  (window as any)._booted = true;
  (window as any).boot();
}
