// script.js

document.addEventListener("DOMContentLoaded", () => {

    /******************************************************
     * ENGAGEMENT PHOTO SLIDESHOW
     ******************************************************/
    const track = document.querySelector(".slideshow-track");
    const nextButton = document.querySelector(".arrow-right");
    const prevButton = document.querySelector(".arrow-left");

    if (track && nextButton && prevButton) {

        // Get original slides
        let slides = Array.from(track.children);

        // Clone first and last for seamless looping
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        firstClone.id = "first-clone";
        lastClone.id = "last-clone";

        // Add clones to track
        track.appendChild(firstClone);
        track.insertBefore(lastClone, slides[0]);

        // Update slides array with clones included
        slides = Array.from(track.children);

        // Starting at index 1 (real first image)
        let index = 1;

        // Determine width of the slides dynamically
        let slideWidth = slides[index].getBoundingClientRect().width;

        // Move track to the first real slide
        track.style.transform = `translateX(${-slideWidth * index}px)`;

        // Helper function to update width on resize
        const updateSlideWidth = () => {
            slideWidth = slides[index].getBoundingClientRect().width;
            track.style.transition = "none";
            track.style.transform = `translateX(${-slideWidth * index}px)`;
            void track.offsetWidth; // Reflow flush
            track.style.transition = "transform 0.5s ease-in-out";
        };

        // Move track to correct slide
        const moveToSlide = () => {
            track.style.transition = "transform 0.5s ease-in-out";
            track.style.transform = `translateX(${-slideWidth * index}px)`;
        };

        // Looping logic after animation completes
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

        // Buttons
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

        // Auto-slide every 5 seconds
        let autoSlide = setInterval(() => {
            index++;
            moveToSlide();
        }, 5000);

        // Pause on hover
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

        // Recalculate widths on resize
        window.addEventListener("resize", updateSlideWidth);
    }

    /******************************************************
     * FORM HANDLING
     ******************************************************/
    const weddingForm = document.getElementById("weddingForm");
    const buffetForm = document.getElementById("buffetForm");
    const weddingMessage = document.getElementById("weddingMessage");
    const buffetMessage = document.getElementById("buffetMessage");

    function setupForm(form, messageBox) {
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            messageBox.textContent = `Thank you, ${data.name || "Guest"}! Your RSVP has been recorded.`;
            messageBox.style.opacity = 1;

            form.reset();

            setTimeout(() => {
                messageBox.style.opacity = 0;
            }, 4000);
        });
    }

    setupForm(weddingForm, weddingMessage);
    setupForm(buffetForm, buffetMessage);
});
