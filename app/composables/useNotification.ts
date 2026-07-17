export interface Notification {
    show: boolean;
    type: 'error' | 'success';
    title: string;
    message: string;
}

export const useNotification = () => {
    // Stato globale condiviso tra tutti i componenti
    const notification = useState<Notification>('global_notification', () => ({
        show: false,
        type: 'error',
        title: '',
        message: ''
    }));

    // Funzione per mostrare un errore
    const notifyError = (message: string, title = 'Si è verificato un errore') => {
        notification.value = { show: true, type: 'error', title, message };
    };

    // Funzione per mostrare un successo
    const notifySuccess = (message: string, title = 'Operazione completata') => {
        notification.value = { show: true, type: 'success', title, message };
    };

    // Funzione per chiudere il banner
    const clearNotification = () => {
        notification.value.show = false;
    };

    return {
        notification,
        notifyError,
        notifySuccess,
        clearNotification
    };
};