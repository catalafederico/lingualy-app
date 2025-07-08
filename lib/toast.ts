import { toast as sonnerToast } from "sonner";

/**
 * Toast utility functions for consistent notifications throughout the app
 */

export const toast = {
  /**
   * Show a success toast notification
   */
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show an error toast notification
   */
  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  },

  /**
   * Show an info toast notification
   */
  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a warning toast notification
   */
  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a loading toast notification
   * Returns a function to dismiss the toast
   */
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (id: string | number) => {
    return sonnerToast.dismiss(id);
  },

  /**
   * Promise toast - shows loading, then success/error based on promise result
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};