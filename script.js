document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector(".body");

    if (!body) return;

    const sleep = (ms) =>
        new Promise(resolve => setTimeout(resolve, ms));


    // -------------------------
    // TYPEWRITER
    // -------------------------

    async function typeText(element, speed = 35) {
        const text = element.textContent;

        element.textContent = "";

        for (const char of text) {
            element.textContent += char;
            await sleep(speed);
        }
    }


    // -------------------------
    // GET SECTIONS
    // -------------------------

    const sections = [...body.children].filter(
        element => element.tagName === "DIV"
    );


    // -------------------------
    // INITIAL STATE
    // -------------------------

    sections.forEach(section => {

        const prompt = section.querySelector(":scope > .prompt");

        if (!prompt) return;

        const content = prompt.nextElementSibling;

        if (!content) return;

        // Social icons start hidden
        if (content.classList.contains("socials")) {

            content.style.display = "flex";
            content.style.visibility = "visible";
            content.style.opacity = "1";

            content.querySelectorAll(".social-icon").forEach(icon => {
                icon.style.opacity = "0";
                icon.style.visibility = "hidden";
                icon.style.transform = "translateY(5px)";
            });

        } else {

            // Normal output starts hidden
            content.style.opacity = "0";
            content.style.visibility = "hidden";
        }
    });


    // Hide dividers initially
    body.querySelectorAll(".div-line").forEach(line => {
        line.style.opacity = "0";
    });


    // -------------------------
    // NORMAL OUTPUT
    // -------------------------

    async function revealContent(content) {

        if (!content) return;

        content.style.visibility = "visible";
        content.style.transition = "opacity 0.35s ease";

        requestAnimationFrame(() => {
            content.style.opacity = "1";
        });

        await sleep(400);
    }


    // -------------------------
    // SOCIAL ICONS
    // -------------------------

    async function revealSocials(socials) {

        const icons = [...socials.querySelectorAll(".social-icon")];

        await sleep(250);

        for (const icon of icons) {

            icon.style.visibility = "visible";
            icon.style.transition =
                "opacity 0.3s ease, transform 0.3s ease";

            requestAnimationFrame(() => {
                icon.style.opacity = "0.7";
                icon.style.transform = "translateY(0)";
            });

            await sleep(180);
        }

        await sleep(250);
    }


    // -------------------------
    // ANIMATE SECTIONS
    // -------------------------

    async function run() {

        for (const section of sections) {

            const prompt = section.querySelector(":scope > .prompt");

            if (!prompt) continue;

            const command = prompt.querySelector(".line");

            if (!command) continue;


            // The final prompt has no output after it
            const content = prompt.nextElementSibling;


            // Don't animate final input prompt yet
            if (!content) continue;


            // Type command
            await typeText(command);

            await sleep(200);


            // Socials
            if (content.classList.contains("socials")) {

                await revealSocials(content);

            }

            // Everything else
            else {

                await revealContent(content);
            }


            // Reveal divider after this section
            const divider = section.nextElementSibling;

            if (divider && divider.classList.contains("div-line")) {

                divider.style.transition = "opacity 0.25s ease";
                divider.style.opacity = "1";

                await sleep(250);
            }
        }


        // Reveal final prompt
        const prompts = [...body.querySelectorAll(":scope > div > .prompt")];
        const lastPrompt = prompts[prompts.length - 1];

        if (lastPrompt) {

            lastPrompt.style.opacity = "0";
            lastPrompt.style.transition = "opacity 0.35s ease";

            requestAnimationFrame(() => {
                lastPrompt.style.opacity = "1";
            });
        }
    }


    // Start
    setTimeout(run, 300);
});