/**
 * Displays an alert message with customizable styles.
 *
 * @param {string} message - The message to display.
 * @param {string} type - The type of alert ('success', 'error', 'warning', 'info').
 * @param {number} duration - How long the alert should be visible (default: 3000ms).
 */
export function showAlert(message, type = 'info', duration = 3000) {
    const alertContainer = document.getElementById('alertContainer');

    if (!alertContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.classList.add(
        'px-4',
        'py-2',
        'rounded-lg',
        'shadow-md',
        'text-white',
        'flex',
        'items-center',
        'justify-between',
        'gap-4',
        'animate-slideDown',
        'opacity-0',
        'transition-opacity'
    );

    switch (type) {
        case 'success':
            alertDiv.classList.add('bg-pink-500', 'border', 'border-pink-700');
            break;
        case 'error':
            alertDiv.classList.add('bg-red', 'border', 'border-darkRed');
            break;
        case 'warning':
            alertDiv.classList.add(
                'bg-yellow-500',
                'border',
                'border-yellow-700',
                'text-black'
            );
            break;
        default:
            alertDiv.classList.add('bg-blue-500', 'border', 'border-blue-700');
    }

    alertDiv.innerHTML = `
    <span class="font-semibold">${message}</span>
    <button onclick="this.parentElement.remove()" class="text-xl font-bold hover:opacity-75">&times;</button>
`;

    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.classList.add('opacity-100');
    }, 100);

    setTimeout(() => {
        alertDiv.classList.add('opacity-0');
        setTimeout(() => alertDiv.remove(), 500);
    }, duration);
}
