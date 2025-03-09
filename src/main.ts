import "/src/styles/fonts.scss";
import "/src/styles/defaults/style.scss";
import "/src/styles/defaults/header.scss";
// -------------------------------------------------------------------------------
import { root, path, translateDOM, getTheme, switchTheme, hvcode, temporaryClass } from "./globals";
// -------------------------------------------------------------------------------
translateDOM();
// -------------------------------------------------------------------------------
root.setAttribute("data-theme", getTheme());

window.addEventListener("storage", e => {
    if (e.key === "theme") root.setAttribute("data-theme", e.newValue!);
});
// -------------------------------------------------------------------------------
const homes = document.querySelectorAll(".home")!;
const cometoplays = document.querySelectorAll(".come-to-play")!;

if (homes) {
    homes.forEach(home => {
        home.setAttribute("href", path.index);
        home.setAttribute("target", "_top");
    });
}

if (cometoplays) {
    cometoplays.forEach(come => {
        come.setAttribute("href", path.playground);
        come.setAttribute("target", "_blank");
    });
}
// -------------------------------------------------------------------------------
const switchtheme = document.querySelector(".switch-theme")!;

if (switchtheme) {
    if (getTheme() != "light") switchtheme.classList.toggle("dark");

    switchtheme.addEventListener("click", () => {
        switchTheme();
        switchtheme.classList.toggle("dark");
    });
}
// -------------------------------------------------------------------------------
const copies = document.querySelectorAll(".copy")!;

if (copies) {
    const commands = document.querySelectorAll(".cmd")!;

    copies.forEach((copy, i) =>
        copy.addEventListener("click", () => {
            const text = commands[i].textContent!;

            try {
                navigator.clipboard.writeText(text);
            }
            catch {
                console.log(text);
            }
            finally {
                temporaryClass(copy, "copied");
            }
        })
    );
}
// -------------------------------------------------------------------------------
const opens = document.querySelectorAll(".open")!;

if (opens) {
    const codes = document.querySelectorAll(".ahv")!;

    opens.forEach((open, i) => {
        const code = hvcode(codes[i].textContent!);
        
        open.setAttribute("href", code.toString());
        open.setAttribute("target", "_blank");
    });
}