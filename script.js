
// script.js

/*** SLIDESHOW ***/
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".slideshow-track");
    const slides = Array.from(track.children);
    const nextButton = document.querySelector(".arrow-right");
    const prevButton = document.querySelector(".arrow-left");

    // CLONE first and last slides for seamless looping
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    firstClone.id = "first-clone";
    lastClone.id = "last-clone";

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const allSlides = Array.from(track.children);
    let index = 1; // start at first REAL slide

    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${slideWidth * index}px)`;

    const moveToSlide = () => {
        track.style.transition = "transform 0.5s ease-in-out";
        track.style.transform = `translateX(-${slideWidth * index}px)`;
    };

    const handleTransitionEnd = () => {
        const currentSlides = Array.from(track.children);

        if (currentSlides[index].id === "first-clone") {
            track.style.transition = "none";
            index = 1;
            track.style.transform = `translateX(-${slideWidth * index}px)`;
        }

        if (currentSlides[index].id === "last-clone") {
            track.style.transition = "none";
            index = currentSlides.length - 2;
            track.style.transform = `translateX(-${slideWidth * index}px)`;
        }
    };

    track.addEventListener("transitionend", handleTransitionEnd);

    nextButton.addEventListener("click", () => {
        index++;
        moveToSlide();
    });

    prevButton.addEventListener("click", () => {
        index--;
        moveToSlide();
    });

    // Auto-slide
    setInterval(() => {
        index++;
        moveToSlide();
    }, 5000);
});


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

