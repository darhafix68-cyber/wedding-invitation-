import {
    auth,
    db
} from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    ref,
    get,
    set,
    push,
    update
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// =========================================
// ELEMENTS
// =========================================

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutButton = document.getElementById("logoutButton");


// =========================================
// AUTH STATE
// =========================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        loginScreen.style.display = "none";
        dashboard.classList.add("show");

        loadWeddingSettings();
        loadGuests();

    } else {

        loginScreen.style.display = "flex";
        dashboard.classList.remove("show");

    }

});


// =========================================
// LOGIN
// =========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document
        .getElementById("loginEmail")
        .value
        .trim();

    const password = document
        .getElementById("loginPassword")
        .value;

    loginError.textContent = "";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    } catch (error) {

        console.error("Login error:", error);

        loginError.textContent =
            "Invalid email or password.";

    }

});


// =========================================
// LOGOUT
// =========================================

logoutButton.addEventListener("click", async () => {

    try {

        await signOut(auth);

    } catch (error) {

        console.error("Logout error:", error);

    }

});


// =========================================
// NAVIGATION
// =========================================

const navItems =
    document.querySelectorAll(".nav-item");

const sections =
    document.querySelectorAll(".dashboard-section");

const pageTitle =
    document.getElementById("pageTitle");


navItems.forEach((button) => {

    button.addEventListener("click", () => {

        const sectionName =
            button.dataset.section;

        navItems.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        sections.forEach((section) => {
            section.classList.remove("active");
        });

        const target =
            document.getElementById(sectionName);

        if (target) {
            target.classList.add("active");
        }

        const titles = {

            overview: "Overview",
            events: "Wedding Events",
            guests: "Guests",
            venue: "Wedding Venue"

        };

        pageTitle.textContent =
            titles[sectionName] || "Dashboard";

    });

});


// =========================================
// LOAD WEDDING SETTINGS
// =========================================

async function loadWeddingSettings() {

    try {

        const settingsRef =
            ref(db, "weddingSettings/main");

        const snapshot =
            await get(settingsRef);

        if (!snapshot.exists()) {

            console.log(
                "Wedding settings not found yet."
            );

            return;

        }

        const data =
            snapshot.val();

        document.getElementById("mehndiDate").value =
            data.mehndiDate || "";

        document.getElementById("mehndiTime").value =
            data.mehndiTime || "";

        document.getElementById("walimaDate").value =
            data.walimaDate || "";

        document.getElementById("walimaTime").value =
            data.walimaTime || "";

        document.getElementById("venueName").value =
            data.venueName || "";

        document.getElementById("venueAddress").value =
            data.venueAddress || "";

        document.getElementById("mapsLink").value =
            data.mapsLink || "";

        updateOverviewDates(data);

    } catch (error) {

        console.error(
            "Settings loading error:",
            error
        );

    }

}


// =========================================
// SAVE EVENTS
// =========================================

const saveEventsButton =
    document.getElementById("saveEvents");


if (saveEventsButton) {

    saveEventsButton.addEventListener(
        "click",
        async () => {

            const mehndiDate =
                document.getElementById(
                    "mehndiDate"
                ).value;

            const mehndiTime =
                document.getElementById(
                    "mehndiTime"
                ).value;

            const walimaDate =
                document.getElementById(
                    "walimaDate"
                ).value;

            const walimaTime =
                document.getElementById(
                    "walimaTime"
                ).value;


            if (!mehndiDate || !walimaDate) {

                alert(
                    "Please enter both Mehndi and Walima dates."
                );

                return;

            }


            const data = {

                mehndiDate:
                    mehndiDate,

                mehndiTime:
                    mehndiTime,

                walimaDate:
                    walimaDate,

                walimaTime:
                    walimaTime

            };


            try {

                await update(
                    ref(
                        db,
                        "weddingSettings/main"
                    ),
                    data
                );


                document.getElementById(
                    "eventSuccess"
                ).textContent =
                    "Wedding dates saved successfully.";


                updateOverviewDates(data);


                setTimeout(() => {

                    document.getElementById(
                        "eventSuccess"
                    ).textContent = "";

                }, 3000);


                console.log(
                    "Wedding events saved successfully."
                );

            } catch (error) {

                console.error(
                    "Save events error:",
                    error
                );

                alert(
                    "Unable to save wedding dates.\n\n" +
                    error.message
                );

            }

        }
    );

}


// =========================================
// SAVE VENUE
// =========================================

const saveVenueButton =
    document.getElementById("saveVenue");


if (saveVenueButton) {

    saveVenueButton.addEventListener(
        "click",
        async () => {

            const venueName =
                document.getElementById(
                    "venueName"
                ).value.trim();

            const venueAddress =
                document.getElementById(
                    "venueAddress"
                ).value.trim();

            const mapsLink =
                document.getElementById(
                    "mapsLink"
                ).value.trim();


            if (!venueName) {

                alert(
                    "Please enter venue name."
                );

                return;

            }


            const data = {

                venueName:
                    venueName,

                venueAddress:
                    venueAddress,

                mapsLink:
                    mapsLink

            };


            try {

                await update(
                    ref(
                        db,
                        "weddingSettings/main"
                    ),
                    data
                );


                document.getElementById(
                    "venueSuccess"
                ).textContent =
                    "Venue saved successfully.";


                setTimeout(() => {

                    document.getElementById(
                        "venueSuccess"
                    ).textContent = "";

                }, 3000);


                console.log(
                    "Venue saved successfully."
                );

            } catch (error) {

                console.error(
                    "Save venue error:",
                    error
                );

                alert(
                    "Unable to save venue.\n\n" +
                    error.message
                );

            }

        }
    );

}


// =========================================
// OVERVIEW DATES
// =========================================

function updateOverviewDates(data) {

    const overviewMehndi =
        document.getElementById(
            "overviewMehndi"
        );

    const overviewWalima =
        document.getElementById(
            "overviewWalima"
        );


    if (overviewMehndi) {

        overviewMehndi.textContent =
            formatDate(data.mehndiDate);

    }


    if (overviewWalima) {

        overviewWalima.textContent =
            formatDate(data.walimaDate);

    }

}


function formatDate(dateString) {

    if (!dateString) {

        return "Not set";

    }

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// =========================================
// ADD GUEST UI
// =========================================

const guestFormCard =
    document.getElementById(
        "guestFormCard"
    );

const addGuestButton =
    document.getElementById(
        "addGuestButton"
    );

const cancelGuest =
    document.getElementById(
        "cancelGuest"
    );


if (addGuestButton) {

    addGuestButton.addEventListener(
        "click",
        () => {

            guestFormCard.classList.add(
                "show"
            );

            document
                .getElementById(
                    "guestNameInput"
                )
                .focus();

        }
    );

}


if (cancelGuest) {

    cancelGuest.addEventListener(
        "click",
        () => {

            guestFormCard.classList.remove(
                "show"
            );

        }
    );

}


// =========================================
// SAVE GUEST
// =========================================

const saveGuestButton =
    document.getElementById(
        "saveGuest"
    );


if (saveGuestButton) {

    saveGuestButton.addEventListener(
        "click",
        async () => {

            const name =
                document
                    .getElementById(
                        "guestNameInput"
                    )
                    .value
                    .trim();


            const allowedGuests =
                parseInt(
                    document
                        .getElementById(
                            "allowedGuestsInput"
                        )
                        .value
                );


            if (!name) {

                alert(
                    "Please enter guest name."
                );

                return;

            }


            if (
                !allowedGuests ||
                allowedGuests < 1
            ) {

                alert(
                    "Please enter valid guest count."
                );

                return;

            }


            try {

                const guestsRef =
                    ref(
                        db,
                        "weddingGuests"
                    );


                const newGuestRef =
                    push(guestsRef);


                await set(
                    newGuestRef,
                    {

                        name:
                            name,

                        allowedGuests:
                            allowedGuests,

                        status:
                            "pending",

                        createdAt:
                            Date.now()

                    }
                );


                document.getElementById(
                    "guestNameInput"
                ).value = "";


                document.getElementById(
                    "allowedGuestsInput"
                ).value = "1";


                guestFormCard.classList.remove(
                    "show"
                );


                await loadGuests();


                alert(
                    "Guest saved successfully."
                );


                console.log(
                    "Guest saved successfully."
                );

            } catch (error) {

                console.error(
                    "Save guest error:",
                    error
                );

                alert(
                    "Unable to save guest.\n\n" +
                    error.message
                );

            }

        }
    );

}


// =========================================
// LOAD GUESTS
// =========================================

async function loadGuests() {

    const guestList =
        document.getElementById(
            "guestList"
        );


    if (!guestList) return;


    try {

        const guestsRef =
            ref(
                db,
                "weddingGuests"
            );


        const snapshot =
            await get(guestsRef);


        guestList.innerHTML = "";


        let total = 0;
        let confirmed = 0;
        let declined = 0;
        let pending = 0;


        if (!snapshot.exists()) {

            guestList.innerHTML = `
                <div class="empty-state">
                    No guests added yet.
                </div>
            `;

        } else {

            const guests =
                snapshot.val();


            Object.entries(guests).forEach(
                ([id, guest]) => {

                    total++;


                    if (
                        guest.status ===
                        "accepted"
                    ) {

                        confirmed++;

                    } else if (
                        guest.status ===
                        "declined"
                    ) {

                        declined++;

                    } else {

                        pending++;

                    }


                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "guest-row";


                    const status =
                        guest.status ||
                        "pending";


                    row.innerHTML = `

                        <div class="guest-name">
                            ${escapeHTML(
                                guest.name
                            )}
                        </div>

                        <div>
                            ${guest.allowedGuests}
                        </div>

                        <div>
                            <span class="status ${status}">
                                ${status}
                            </span>
                        </div>

                        <div class="action-buttons">

                            <button
                                class="action-button"
                                data-copy="${id}"
                            >
                                Copy Link
                            </button>

                            <button
                                class="action-button whatsapp"
                                data-whatsapp="${id}"
                            >
                                WhatsApp
                            </button>

                        </div>
                    `;


                    guestList.appendChild(
                        row
                    );

                }
            );

        }


        document.getElementById(
            "totalGuests"
        ).textContent =
            total;


        document.getElementById(
            "confirmedGuests"
        ).textContent =
            confirmed;


        document.getElementById(
            "declinedGuests"
        ).textContent =
            declined;


        document.getElementById(
            "pendingGuests"
        ).textContent =
            pending;


        // =========================================
        // COPY LINKS
        // =========================================

        document
            .querySelectorAll(
                "[data-copy]"
            )
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.copy;


                        const link =
                            createInvitationLink(
                                id
                            );


                        try {

                            await navigator
                                .clipboard
                                .writeText(
                                    link
                                );


                            button.textContent =
                                "Copied!";


                            setTimeout(() => {

                                button.textContent =
                                    "Copy Link";

                            }, 1500);

                        } catch (error) {

                            console.error(
                                "Copy error:",
                                error
                            );

                        }

                    }
                );

            });


        // =========================================
        // WHATSAPP
        // =========================================

        document
            .querySelectorAll(
                "[data-whatsapp]"
            )
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.whatsapp;


                        try {

                            const guestSnapshot =
                                await get(
                                    ref(
                                        db,
                                        `weddingGuests/${id}`
                                    )
                                );


                            if (
                                !guestSnapshot.exists()
                            ) {

                                alert(
                                    "Guest not found."
                                );

                                return;

                            }


                            const guest =
                                guestSnapshot.val();


                            const link =
                                createInvitationLink(
                                    id
                                );


                            const message =
                                `Dear ${guest.name},\n\n` +
                                `You are cordially invited to celebrate this beautiful occasion with us.\n\n` +
                                link;


                            const whatsapp =
                                `https://wa.me/?text=${encodeURIComponent(
                                    message
                                )}`;


                            window.open(
                                whatsapp,
                                "_blank"
                            );


                        } catch (error) {

                            console.error(
                                "WhatsApp error:",
                                error
                            );

                        }

                    }
                );

            });


    } catch (error) {

        console.error(
            "Load guests error:",
            error
        );


        guestList.innerHTML = `
            <div class="empty-state">
                Unable to load guests.
            </div>
        `;

    }

}


// =========================================
// CREATE INVITATION LINK
// =========================================

function createInvitationLink(id) {

    return (
        window.location.origin +
        window.location.pathname
            .replace(
                "admin.html",
                "index.html"
            ) +
        "?id=" +
        encodeURIComponent(id)
    );

}


// =========================================
// HTML ESCAPE
// =========================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll(
            "'",
            "&#039;"
        );

}