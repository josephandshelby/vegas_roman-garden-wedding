// script.js

document.addEventListener("DOMContentLoaded", () => {

    /******************************************************
     * ENGAGEMENT PHOTO SLIDESHOW
     ******************************************************/
    const track = document.querySelector(".slideshow-track");
    const nextButton = document.querySelector(".arrow-right");
    const prevButton = document.querySelector(".arrow-left");

    if (track && nextButton && prevButton) {

        let slides = Array.from(track.children);

        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        firstClone.id = "first-clone";
        lastClone.id = "last-clone";

        track.appendChild(firstClone);
        track.insertBefore(lastClone, slides[0]);

        slides = Array.from(track.children);
        let index = 1;

        let slideWidth = slides[index].getBoundingClientRect().width;

        track.style.transform = `translateX(${-slideWidth * index}px)`;

        const updateSlideWidth = () => {
            slideWidth = slides[index].getBoundingClientRect().width;
            track.style.transition = "none";
            track.style.transform = `translateX(${-slideWidth * index}px)`;
            void track.offsetWidth;
            track.style.transition = "transform 0.5s ease-in-out";
        };

        const moveToSlide = () => {
            track.style.transition = "transform 0.5s ease-in-out";
            track.style.transform = `translateX(${-slideWidth * index}px)`;
        };

        track.addEventListener("transitionend", () => {
            const currentSlide = slides[index];

            if (currentSlide.id === "first-clone") {
                track.style.transition = "none";
                index = 1;
                track.style.transform = `translateX(${-slideWidth * index}px)`;
            }

            if (currentSlide.id === "last-clone") {
                track.style.transition = "none";
                index = slides.length - 2;
                track.style.transform = `translateX(${-slideWidth * index}px)`;
            }
        });

        nextButton.addEventListener("click", () => {
            if (index >= slides.length - 1) return;
            index++;
            moveToSlide();
        });

        prevButton.addEventListener("click", () => {
            if (index <= 0) return;
            index--;
            moveToSlide();
        });

        let autoSlide = setInterval(() => {
            index++;
            moveToSlide();
        }, 5000);

        const pause = () => clearInterval(autoSlide);
        const resume = () => {
            clearInterval(autoSlide);
            autoSlide = setInterval(() => {
                index++;
                moveToSlide();
            }, 5000);
        };

        track.addEventListener("mouseenter", pause);
        track.addEventListener("mouseleave", resume);
        nextButton.addEventListener("mouseenter", pause);
        prevButton.addEventListener("mouseenter", pause);
        nextButton.addEventListener("mouseleave", resume);
        prevButton.addEventListener("mouseleave", resume);

        window.addEventListener("resize", updateSlideWidth);
    }

    /******************************************************
     * GOOGLE SCRIPT WEB APP URLS
     ******************************************************/
    const WEDDING_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbzkrKRLMpxV1C8DdGnLGR8Wtr8e4AdVq8dW2qNkQhTsROHPUyDw6GDWfO9JNbtMzzw1/exec";

    const BUFFET_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbzsmlIoturA-HXxD7lxnENtTqB6kOf4RgY3esgmjcba9uRdn1w0-mvwwuo16RQ1kNqhWg/exec";

    /******************************************************
     * GENERIC FORM SUBMISSION HANDLER
     ******************************************************/
    async function submitForm(data, messageBox, url, resetCallback) {
        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.result === "success") {
                messageBox.textContent = `Thank you, ${data.name || "Guest"}! Your RSVP has been recorded.`;
            } else {
                messageBox.textContent = "There was a problem submitting your RSVP.";
            }

        } catch (err) {
            messageBox.textContent = "Unable to connect. Please try again.";
        }

        messageBox.style.opacity = 1;

        resetCallback();

        setTimeout(() => {
            messageBox.style.opacity = 0;
        }, 4000);
    }

    /******************************************************
     * WEDDING FORM
     ******************************************************/
    const weddingForm = document.getElementById("weddingForm");
    const weddingMessage = document.getElementById("weddingMessage");

    if (weddingForm) {
        weddingForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(weddingForm).entries());

            submitForm(
                data,
                weddingMessage,
                WEDDING_SCRIPT_URL,
                () => weddingForm.reset()
            );
        });
    }

    /******************************************************
     * BUFFET FORM (ADULT + CHILD GUESTS)
     ******************************************************/
    const buffetForm = document.getElementById("buffetForm");
    const buffetMessage = document.getElementById("buffetMessage");

    if (buffetForm) {
        buffetForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Collect form entries
            const data = Object.fromEntries(new FormData(buffetForm).entries());

            // Add checkbox acknowledgement
            const check = buffetForm.querySelector("input[type='checkbox']");
            data.acknowledgedFee = check?.checked ? "Yes" : "No";

            submitForm(
                data,
                buffetMessage,
                BUFFET_SCRIPT_URL,
                () => buffetForm.reset()
            );
        });
    }

});
