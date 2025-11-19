// script.js

document.addEventListener("DOMContentLoaded", () => {

    /******************************************************
     * ENGAGEMENT PHOTO SLIDESHOW (UNCHANGED)
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
            const current = slides[index];

            if (current.id === "first-clone") {
                track.style.transition = "none";
                index = 1;
                track.style.transform = `translateX(${-slideWidth * index}px)`;
            }

            if (current.id === "last-clone") {
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
    const WEDDING_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxcgsO_6g6j-2U-eY-fS4OFnYDiOeRc8k4pTmSV21HLmAK0PqkYSI60WtIZfQv7mq9k/exec";
    const BUFFET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbznywH5K20OIYNQZBmfDdpCLiesMLbw18uauI85LYoii4mqVVTVPUFrnFx2VOEfJoW36Q/exec";

    /******************************************************
     * FORM SUBMISSION HANDLER
     ******************************************************/
    async function submitForm(form, messageBox, url) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

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

        } catch (error) {
            messageBox.textContent = "Unable to connect. Please try again.";
        }

        messageBox.style.opacity = 1;

        form.reset();

        setTimeout(() => {
            messageBox.style.opacity = 0;
        }, 4000);
    }

    /******************************************************
     * CONNECT FORMS TO URLS
     ******************************************************/
    const weddingForm = document.getElementById("weddingForm");
    const buffetForm = document.getElementById("buffetForm");
    const weddingMessage = document.getElementById("weddingMessage");
    const buffetMessage = document.getElementById("buffetMessage");

    if (weddingForm) {
        weddingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            submitForm(weddingForm, weddingMessage, WEDDING_SCRIPT_URL);
        });
    }

    if (buffetForm) {
        buffetForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Add missing checkbox data
            const check = buffetForm.querySelector("input[type='checkbox']");
            const acknowledgedFee = check?.checked ? "Yes" : "No";

            const formData = new FormData(buffetForm);
            formData.append("acknowledgedFee", acknowledgedFee);

            const messageBox = buffetMessage;

            // custom submit for buffet with extra field
            submitForm(
                {
                    reset: () => buffetForm.reset(),
                    entries: () => formData.entries()
                },
                messageBox,
                BUFFET_SCRIPT_URL
            );
        });
    }

});
