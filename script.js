
// script.js

document.addEventListener("DOMContentLoaded", () => {
    /*** SLIDESHOW ***/
    const track = document.querySelector(".slideshow-track");
    const slides = Array.from(track.children);
    const nextButton = document.querySelector(".arrow-right");
    const prevButton = document.querySelector(".arrow-left");
    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange slides next to each other
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + "px";
    });

    let currentIndex = 0;

    const moveToSlide = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        track.style.transform = `translateX(-${slideWidth * index}px)`;
        currentIndex = index;
    };

    nextButton.addEventListener("click", () => moveToSlide(currentIndex + 1));
    prevButton.addEventListener("click", () => moveToSlide(currentIndex - 1));

    // Optional: auto-slide every 5 seconds
    setInterval(() => moveToSlide(currentIndex + 1), 5000);

    /*** RSVP FORM HANDLING ***/
    const weddingForm = document.getElementById("weddingForm");
    const buffetForm = document.getElementById("buffetForm");
    const weddingMessage = document.getElementById("weddingMessage");
    const buffetMessage = document.getElementById("buffetMessage");

    const handleFormSubmit = (form, messageEl) => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Simple feedback, replace with real backend call if needed
            messageEl.textContent = "Thank you, " + (data.name || "Guest") + "! Your RSVP has been recorded.";
            messageEl.style.opacity = 1;
            form.reset();

            setTimeout(() => {
                messageEl.style.opacity = 0;
            }, 5000);
        });
    };

    handleFormSubmit(weddingForm, weddingMessage);
    handleFormSubmit(buffetForm, buffetMessage);
});
