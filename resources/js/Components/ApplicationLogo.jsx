export default function ApplicationLogo(props) {
    return (
        <div className="flex flex-row w-auto items-center gap-2" {...props}>
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 3L2 9v11a1 1 0 001 1h18a1 1 0 001-1V9l-10-6zm8 16H4v-8.5l8-4.8 8 4.8V19zm-8-7a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </div>
            <div>
                <h1 className="text-xl font-bold text-amber-900 dark:text-amber-400">
                    LuxStay
                </h1>
            </div>
        </div>
    );
}
