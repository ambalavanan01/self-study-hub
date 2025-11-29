

export function AuthBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#FF8BA7]">
            <svg
                className="absolute left-0 top-0 h-full w-full opacity-50"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <path
                    d="M0 0 V50 Q25 40 50 50 T100 50 V0 Z"
                    fill="#FFC6D3"
                />
                <path
                    d="M0 100 V60 Q25 70 50 60 T100 60 V100 Z"
                    fill="#FFC6D3"
                />
                {/* Abstract curves to mimic the design */}
                <path
                    d="M0 0 C 30 20 70 20 100 0 Z"
                    fill="rgba(255, 255, 255, 0.1)"
                />
                <circle cx="20" cy="30" r="40" fill="rgba(255, 255, 255, 0.05)" />
                <circle cx="80" cy="70" r="30" fill="rgba(255, 255, 255, 0.05)" />
            </svg>
            {/* White wave at the bottom/middle where the form starts */}
            <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-white rounded-t-[3rem] shadow-2xl"></div>
        </div>
    );
}
