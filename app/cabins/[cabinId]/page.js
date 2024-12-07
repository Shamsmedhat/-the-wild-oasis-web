import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import Cabin from "@/app/_components/Cabin";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
    const { name } = await getCabin(params.cabinId);

    return {
        title: `Cabin ${name}`,
    };
}

export async function generateStaticParams() {
    const canbins = await getCabins();
    const ids = canbins.map(cabin => {
        cabinId: String(cabin.id);
    });
    return ids;
}

export const revalidate = 0;

export default async function Page({ params }) {
    const cabin = await getCabin(params.cabinId);

    // const [cabin, settings, bookedDates] = await Promise.all([getCabin(params.cabinId), getSettings(), getBookedDatesByCabinId(params.cabinId)]);
    // Promise.all can only be as fast as the slowest promise
    const { name } = cabin;

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-10 mb-24">
                <Cabin cabin={cabin} />
            </div>

            <div>
                <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">Reserve {name} today. Pay on arrival.</h2>
                <Suspense fallback={<Spinner />}>
                    <Reservation cabin={cabin} />
                </Suspense>
            </div>
        </div>
    );
}
