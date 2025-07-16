import Link from "next/link";

export default function Footer() {
    return (
        <footer className="text-center flex gap-2 m-auto justify-center mt-40 text-lg">
            <span>Made with ❤️ , by Tausiq Samantaray</span>

            <Link
                href="https://buymeacoffee.com/tausiqsamantaray"
                target="_blank"
                className="underline text-blue-400"
            >
                Support me here
            </Link>
        </footer>
    );
}
