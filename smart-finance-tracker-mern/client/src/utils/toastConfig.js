import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
};

export const showToast = {
    success: (message) => toast.success(message, toastConfig),
    error: (message) => toast.error(message, toastConfig),
    info: (message) => toast.info(message, toastConfig),
    warning: (message) => toast.warning(message, toastConfig),
};