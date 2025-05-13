import clsx from "clsx";

export default function Label({
    name,
    elo,
    orientation,
}: {
    name: string;
    elo: string;
    orientation: string;
}) {
    return (
        <div
            className={clsx(
                "rounded-md p-2 my-2",
                orientation === "black"
                    ? "bg-[#262421] text-white"
                    : "bg-white text-[#262421]",
            )}
        >
            <p className="text-sm md:text-xl">
                {name} ({elo})
            </p>
        </div>
    );
}
