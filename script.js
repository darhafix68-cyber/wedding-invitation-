// =========================================
// FIREBASE
// =========================================

import { db } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// =========================================
// ELEMENTS
// =========================================

const openingScreen =
    document.getElementById("openingScreen");

const openInvitation =
    document.getElementById("openInvitation");

const envelope =
    document.querySelector(".envelope");

const invitation =
    document.getElementById("invitation");

const curtainTransition =
    document.getElementById("curtainTransition");

const musicButton =
    document.getElementById("musicButton");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const shareButton =
    document.getElementById("shareButton");

const locationButton =
    document.querySelector(".location-button");


// =========================================
// OPENING STATE
// =========================================

let invitationOpening = false;

document.body.classList.add("invitation-opening");
document.body.style.overflow = "hidden";


// =========================================
// OPEN INVITATION
// =========================================

if (openInvitation) {

    openInvitation.addEventListener("click", () => {

        // Prevent double click
        if (invitationOpening) {
            return;
        }

        invitationOpening = true;

        openInvitation.disabled = true;

        // -----------------------------------------
        // STEP 1: OPEN ENVELOPE
        // -----------------------------------------

        if (envelope) {
            envelope.classList.add("open");
        }

        // Start music immediately after user interaction
        startMusic();


        // -----------------------------------------
        // STEP 2: START CURTAIN
        // -----------------------------------------

        setTimeout(() => {

            if (curtainTransition) {
                curtainTransition.classList.add("active");
            }

        }, 650);


        // -----------------------------------------
        // STEP 3: HIDE OPENING SCREEN
        // -----------------------------------------

        setTimeout(() => {

            if (openingScreen) {
                openingScreen.classList.add("hidden");
            }

        }, 2250);


        // -----------------------------------------
        // STEP 4: REVEAL INVITATION
        // -----------------------------------------

        setTimeout(() => {

            if (invitation) {
                invitation.classList.add("visible");
            }

            document.body.classList.remove(
                "invitation-opening"
            );

            document.body.style.overflow = "auto";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            // -----------------------------------------
            // CLEAN CURTAIN
            // -----------------------------------------

            setTimeout(() => {

                if (curtainTransition) {
                    curtainTransition.classList.remove(
                        "active"
                    );
                }

            }, 1000);


        }, 2350);

    });

}


// =========================================
// BACKGROUND MUSIC
// =========================================

function startMusic() {

    if (!backgroundMusic) {
        return;
    }

    backgroundMusic.volume = 0.35;

    backgroundMusic
        .play()
        .then(() => {

            if (musicButton) {

                musicButton.classList.add(
                    "playing"
                );

                musicButton.innerHTML = "♫";

            }

        })
        .catch(() => {

            console.log(
                "Music autoplay blocked."
            );

        });

}


// =========================================
// MUSIC BUTTON
// =========================================

if (musicButton) {

    musicButton.addEventListener(
        "click",
        () => {

            if (!backgroundMusic) {
                return;
            }


            if (backgroundMusic.paused) {

                backgroundMusic
                    .play()
                    .then(() => {

                        musicButton.classList.add(
                            "playing"
                        );

                        musicButton.innerHTML = "♫";

                    })
                    .catch(() => {

                        console.log(
                            "Unable to play music."
                        );

                    });

            } else {

                backgroundMusic.pause();

                musicButton.classList.remove(
                    "playing"
                );

                musicButton.innerHTML = "🔇";

            }

        }
    );

}


// =========================================
// GOOGLE MAPS FALLBACK
// =========================================

if (locationButton) {

    locationButton.addEventListener(
        "click",
        () => {

            const googleMapsURL =
                "https://maps.app.goo.gl/4PJb4Yr9GzKFVMiR9?g_st=aw";

            window.open(
                googleMapsURL,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


// =========================================
// SHARE INVITATION
// =========================================

if (shareButton) {

    shareButton.addEventListener(
        "click",
        async () => {

            const shareData = {

                title: "Wedding Invitation",

                text:
                    "You are cordially invited to celebrate this beautiful occasion with us.",

                url:
                    window.location.href

            };


            // -----------------------------------------
            // NATIVE SHARE
            // -----------------------------------------

            if (
                navigator.share &&
                window.isSecureContext
            ) {

                try {

                    await navigator.share(
                        shareData
                    );

                } catch (error) {

                    console.log(
                        "Sharing cancelled."
                    );

                }

                return;

            }


            // -----------------------------------------
            // WHATSAPP FALLBACK
            // -----------------------------------------

            const whatsappText =
                encodeURIComponent(
                    "You are cordially invited to celebrate this beautiful occasion with us.\n\n" +
                    window.location.href
                );


            const whatsappURL =
                `https://wa.me/?text=${whatsappText}`;


            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


// =========================================
// REVEAL ANIMATION
// =========================================

const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "section-visible"
                    );

                }

            });

        },
        {
            threshold: 0.15
        }
    );


document
    .querySelectorAll(".section")
    .forEach((section) => {

        observer.observe(section);

    });


// =========================================
// UPDATE WEDDING EVENTS
// =========================================

function updateWeddingEvents(data) {

    const eventCards =
        document.querySelectorAll(
            ".event-card"
        );


    // -----------------------------------------
    // MEHNDI
    // -----------------------------------------

    if (eventCards[0]) {

        const dateElement =
            eventCards[0].querySelector(
                ".event-date"
            );

        const timeElement =
            eventCards[0].querySelector(
                ".event-time"
            );


        if (dateElement) {

            dateElement.textContent =
                formatWeddingDate(
                    data.mehndiDate
                );

        }


        if (timeElement) {

            timeElement.textContent =
                formatWeddingTime(
                    data.mehndiTime
                );

        }

    }


    // -----------------------------------------
    // WALIMA
    // -----------------------------------------

    if (eventCards[1]) {

        const dateElement =
            eventCards[1].querySelector(
                ".event-date"
            );

        const timeElement =
            eventCards[1].querySelector(
                ".event-time"
            );

        const title =
            eventCards[1].querySelector(
                "h3"
            );


        if (title) {

            title.textContent =
                "Walima";

        }


        if (dateElement) {

            dateElement.textContent =
                formatWeddingDate(
                    data.walimaDate
                );

        }


        if (timeElement) {

            timeElement.textContent =
                formatWeddingTime(
                    data.walimaTime
                );

        }

    }


    // -----------------------------------------
    // HIDE OLD NIKAH CARD
    // -----------------------------------------

    if (eventCards[2]) {

        eventCards[2].style.display =
            "none";

    }

}


// =========================================
// UPDATE VENUE
// =========================================

function updateVenue(data) {

    const venueName =
        document.querySelector(
            ".venue-details h3"
        );

    const venueAddress =
        document.querySelector(
            ".venue-details p"
        );

    const locationButton =
        document.querySelector(
            ".location-button"
        );


    // -----------------------------------------
    // VENUE NAME
    // -----------------------------------------

    if (venueName) {

        venueName.textContent =
            data.venueName ||
            "Wedding Venue";

    }


    // -----------------------------------------
    // VENUE ADDRESS
    // -----------------------------------------

    if (venueAddress) {

        venueAddress.textContent =
            data.venueAddress ||
            "";

    }


    // -----------------------------------------
    // GOOGLE MAPS
    // -----------------------------------------

    if (locationButton) {

        locationButton.onclick =
            function () {

                const mapsURL =
                    data.mapsLink ||
                    "https://maps.app.goo.gl/4PJb4Yr9GzKFVMiR9?g_st=aw";


                window.open(
                    mapsURL,
                    "_blank",
                    "noopener,noreferrer"
                );

            };

    }

}


// =========================================
// FORMAT DATE
// =========================================

function formatWeddingDate(dateString) {

    if (!dateString) {

        return "Date to be announced";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    if (isNaN(date.getTime())) {

        return "Date to be announced";

    }


    return date
        .toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )
        .toUpperCase();

}


// =========================================
// FORMAT TIME
// =========================================

function formatWeddingTime(timeString) {

    if (!timeString) {

        return "Time to be announced";

    }


    const parts =
        timeString.split(":");


    const hours =
        Number(parts[0]);

    const minutes =
        Number(parts[1] || 0);


    if (
        isNaN(hours) ||
        isNaN(minutes)
    ) {

        return "Time to be announced";

    }


    const date =
        new Date();


    date.setHours(
        hours,
        minutes,
        0,
        0
    );


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


// =========================================
// COUNTDOWN
// =========================================

let weddingCountdownInterval = null;


function updateWeddingCountdown(data) {

    if (!data.mehndiDate) {

        console.log(
            "Mehndi date not available."
        );

        return;

    }


    const time =
        data.mehndiTime ||
        "20:00";


    const weddingDate =
        new Date(
            `${data.mehndiDate}T${time}:00`
        ).getTime();


    if (isNaN(weddingDate)) {

        console.log(
            "Invalid wedding date/time."
        );

        return;

    }


    if (weddingCountdownInterval) {

        clearInterval(
            weddingCountdownInterval
        );

    }


    function countdown() {

        const now =
            new Date().getTime();


        const difference =
            weddingDate - now;


        if (difference <= 0) {

            setCountdownValues(
                0,
                0,
                0,
                0
            );

            clearInterval(
                weddingCountdownInterval
            );

            return;

        }


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (
                    difference /
                    (1000 * 60 * 60)
                ) % 24
            );


        const minutes =
            Math.floor(
                (
                    difference /
                    (1000 * 60)
                ) % 60
            );


        const seconds =
            Math.floor(
                (
                    difference /
                    1000
                ) % 60
            );


        setCountdownValues(
            days,
            hours,
            minutes,
            seconds
        );

    }


    countdown();


    weddingCountdownInterval =
        setInterval(
            countdown,
            1000
        );

}


// =========================================
// SET COUNTDOWN VALUES
// =========================================

function setCountdownValues(
    days,
    hours,
    minutes,
    seconds
) {

    const daysElement =
        document.getElementById(
            "days"
        );

    const hoursElement =
        document.getElementById(
            "hours"
        );

    const minutesElement =
        document.getElementById(
            "minutes"
        );

    const secondsElement =
        document.getElementById(
            "seconds"
        );


    if (daysElement) {

        daysElement.textContent =
            String(days).padStart(
                2,
                "0"
            );

    }


    if (hoursElement) {

        hoursElement.textContent =
            String(hours).padStart(
                2,
                "0"
            );

    }


    if (minutesElement) {

        minutesElement.textContent =
            String(minutes).padStart(
                2,
                "0"
            );

    }


    if (secondsElement) {

        secondsElement.textContent =
            String(seconds).padStart(
                2,
                "0"
            );

    }

}


// =========================================
// LOAD PERSONALIZED INVITATION
// =========================================

async function loadInvitationData() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const guestId =
        urlParams.get("id");


    // -----------------------------------------
    // CHECK GUEST ID
    // -----------------------------------------

    if (!guestId) {

        console.log(
            "No personalized guest ID found."
        );

        return;

    }


    console.log(
        "Loading guest:",
        guestId
    );


    try {

        // =====================================
        // LOAD GUEST
        // =====================================

        const guestRef =
            ref(
                db,
                `weddingGuests/${guestId}`
            );


        const guestSnapshot =
            await get(
                guestRef
            );


        if (!guestSnapshot.exists()) {

            console.log(
                "Guest not found:",
                guestId
            );

            return;

        }


        const guest =
            guestSnapshot.val();


        console.log(
            "Guest loaded:",
            guest
        );


        // =====================================
        // GUEST NAME
        // =====================================

        const guestNameElement =
            document.getElementById(
                "guestName"
            );


        if (guestNameElement) {

            guestNameElement.textContent =
                guest.name ||
                "Guest";

        }


        // =====================================
        // ALLOWED GUEST COUNT
        // =====================================

        const guestCountElement =
            document.getElementById(
                "guestCount"
            );


        if (guestCountElement) {

            guestCountElement.textContent =
                guest.allowedGuests ||
                "1";

        }


        // =====================================
        // LOAD WEDDING SETTINGS
        // =====================================

        const settingsRef =
            ref(
                db,
                "weddingSettings/main"
            );


        const settingsSnapshot =
            await get(
                settingsRef
            );


        if (
            settingsSnapshot.exists()
        ) {

            const settings =
                settingsSnapshot.val();


            console.log(
                "Wedding settings loaded:",
                settings
            );


            updateWeddingEvents(
                settings
            );


            updateVenue(
                settings
            );


            updateWeddingCountdown(
                settings
            );

        } else {

            console.log(
                "Wedding settings not found."
            );

        }

    } catch (error) {

        console.error(
            "Invitation loading error:",
            error
        );

    }

}


// =========================================
// PAGE LOAD
// =========================================

window.addEventListener(
    "load",
    () => {

        console.log(
            "Wedding Invitation Loaded Successfully ❤️"
        );

    }
);


// =========================================
// START
// =========================================

loadInvitationData();