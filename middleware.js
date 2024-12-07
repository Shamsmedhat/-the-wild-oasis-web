// import { NextResponse } from "next/server";
// export function middleware(request) {
//     return NextResponse.redirect(new URL("/about", request.url));
// }

import { auth } from "./app/_lib/Auth";

export const middleware = auth;

export const config = {
    matcher: ["/account"],
};
