export default class LocationPath {
  static getPageName(location: string): string | undefined {
    if (location === '/dashboard' || location === '/') {
      return 'Dashboard';
    }
    if (location === '/create-reconciliation-report') {
      return 'Create Reconciliation Report';
    }
    if (location.startsWith('/reconciliation-report')) {
      if (location.endsWith('/suggested-matches')) {
        return 'Suggested Matches';
      }
      if (location.endsWith('/manual-reconciliation')) {
        return 'Manual Reconciliation';
      }
      return 'Reconciliation Report';
    }
    if (location.startsWith('/user')) {
      return 'Profile';
    }
    return undefined;
  }

  static isWorkspacePath(location: string): boolean {
    if (location.includes('/workspace') || location.includes('/dashboard') || location === '/') {
      return true;
    }
    return false;
  }
}
