"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./Auth";
import { supabase } from "./supabase";
import { getBooking, getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
    const session = await auth();
    // between 6 and 12 chars
    const regex = /^[A-Za-z0-9]{6,12}$/;

    if (!session.user) throw new Error("You need to login first");
    const nationalID = formData.get("nationalID");
    const [nationality, countryFlag] = formData.get("nationality").split("%");
    if (!regex.test(nationalID)) throw new Error("Invalid national id");
    const updateData = { nationality, countryFlag, nationalID };

    const { error } = await supabase.from("guests").update(updateData).eq("id", session.user.guestId);

    if (error) throw new Error("Guest could not be updated");

    revalidatePath("/account/profile");
}

export async function createReservation(bookingData, formData) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    //we can yse it to make the formData an object
    // Object.entries(formData.entries())

    const newBooking = {
        ...bookingData,
        guestId: session.user.guestId,
        numGuests: Number(formData.get("numGuests")),
        observations: formData.get("observations").slice(0, 1000),
        extrasPrice: 0,
        totalPrice: bookingData.cabinPrice,
        isPaid: false,
        hasBreakfast: false,
        status: "unconfirmed",
    };

    const { error } = await supabase.from("bookings").insert([newBooking]);

    if (error) {
        throw new Error("Booking could not be created");
    }
    revalidatePath(`/cabins/${bookingData.cabinId}`);

    redirect("/cabins/thankyou");
}

export async function deleteReservation(bookingId) {
    // {Auth} Make sure the user the one who only have an access
    const session = await auth();
    if (!session) throw new Error("You must be logged in");
    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingIds = guestBookings.map(booking => booking.id);
    if (!guestBookingIds.includes(bookingId)) throw new Error("you are not allowed to delete this booking");

    // for testing the useOptimistic
    // await new Promise(res => setTimeout(res, 2000));

    // deleting booking
    const { error } = await supabase.from("bookings").delete().eq("id", bookingId);

    if (error) throw new Error("Booking could not be deleted");
    revalidatePath("/account/reservation");
}

export async function updateReservation(formdata) {
    const updatedCabinId = Number(formdata.get("cabinId"));
    // {Auth} Make sure the user the one who only have an access
    const session = await auth();
    if (!session) throw new Error("You must be logged in");
    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingIds = guestBookings.map(booking => booking.id);
    if (!guestBookingIds.includes(updatedCabinId)) throw new Error("you are not allowed to edit this booking");

    // start updating new data

    const numGuestsAfterUpdate = formdata.get("numGuests");
    const observationsAfterUpdate = formdata.get("observations").slice(0, 1000);

    const bookingCabin = await getBooking(updatedCabinId);
    const updatedFields = { ...bookingCabin, numGuests: Number(numGuestsAfterUpdate), observations: observationsAfterUpdate };

    const { error } = await supabase.from("bookings").update(updatedFields).eq("id", updatedCabinId);

    if (error) {
        throw new Error("Booking could not be updated");
    }
    revalidatePath(`/account/reservations/edit/${updatedCabinId}`);
    redirect("/account/reservations");
}

export async function signInAction() {
    await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
    await signOut({ redirectTo: "/" });
}
