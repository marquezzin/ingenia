interface LogoProps {
    size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 160,
};

export function Logo({ size = "md" }: LogoProps) {
    const px = sizeMap[size];
    return (
        <img
            src="/assets/logo.png"
            alt="Ingenia"
            width={px}
            height={px}
            style={{
                objectFit: "contain",
                display: "block",
            }}
        />
    );
}
