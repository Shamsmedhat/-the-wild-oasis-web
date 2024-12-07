import Image from "next/image";
import Link from "next/link";
import bg from "@/public/bg.png";
export default function Page() {
    return (
        <div className="mt-24">
            <Image
                src={bg}
                fill
                placeholder="blur"
                quality={100}
                className="object-cover object-top"
                alt="Mountains and forests with two cabins"
            />

            <div className="relative z-10 text-center">
                <p className="text-8xl text-primary-50 mb-10 tracking-tight font-normal">Welcome to paradise.</p>
                <Link
                    href="/cabins"
                    className="bg-accent-500 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
                >
                    Explore luxury cabins
                </Link>
            </div>
        </div>
    );
}
