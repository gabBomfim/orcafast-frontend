import { toaster } from '../../components/ui/toaster';

export default function feedbackMiddleware(store) {
  return (next) => (action) => {
    if (!action.payload) {
      return next(action);
    }

    if (
      action.payload.response &&
      action.payload.response.data &&
      action.payload.response.data.alert
    ) {
      const { alert } = action.payload.response.data;

      toaster.create({
        title: alert.message,
        type: alert.type
      });
    }

    return next(action);
  };
}
