import Button from "@/app/_components/Button";
import { updateReservation } from "@/app/_lib/actions";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({ params }) {
    const { cabinId } = await getBooking(params.editId);
    const { maxCapacity, name } = await getCabin(cabinId);

    const { numGuests, observations } = await getBooking(params.editId);

    return (
        <div>
            <h2 className="font-semibold text-2xl text-accent-400 mb-7">Edit Reservation #{name}</h2>

            <form
                action={updateReservation}
                className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
            >
                <input
                    type="text"
                    hidden
                    name="cabinId"
                    value={params.editId}
                />
                <div className="space-y-2">
                    <label htmlFor="numGuests">How many guests?</label>
                    <select
                        name="numGuests"
                        id="numGuests"
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                        required
                        defaultValue={numGuests}
                    >
                        <option
                            value=""
                            key=""
                        >
                            Select number of guests...
                        </option>
                        {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(x => (
                            <option
                                value={x}
                                key={x}
                            >
                                {x} {x === 1 ? "guest" : "guests"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="observations">Anything we should know about your stay?</label>
                    <textarea
                        defaultValue={observations}
                        name="observations"
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                    />
                </div>

                <div className="flex justify-end items-center gap-6">
                    <Button>Update reservation</Button>
                </div>
            </form>
        </div>
    );
}
