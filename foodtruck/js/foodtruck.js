const section = document.querySelectorAll(".parallax");
const header = document.querySelector("header");

window.onscroll = () =>
{
    if(window.pageYOffset > 80)
    {
        header.classList.add("scrolling");
    }
    else
    {
        header.classList.remove("scrolling");
    }

    [].slice.call(section).forEach(e =>
    {
        let bgpos = "center " + (window.pageYOffset * 0.4) + "px";

        e.style.backgroundPosition = bgpos;
    });
}
