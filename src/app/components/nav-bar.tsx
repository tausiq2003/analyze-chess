import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="flex flex-row justify-between md:px-4 items-center py-4 px-2 gap-2  border-b border-white bg-black text-center">
            <p className="tracking-tight md:text-xl md:hidden block">
                If you like this project, please support
            </p>
            <p className="tracking-tight md:block hidden md:text-xl">
                This app is kept free forever, if you like this project, please
                support:
            </p>
            <button className="bg-blue-500 rounded-lg py-1 px-2">
                <Link
                    href="https://buymeacoffee.com/tausiqsamantaray"
                    target="_blank"
                    className="text-sm md:text-xl"
                >
                    Support me here ❤️
                </Link>
            </button>
        </nav>
    );
}
