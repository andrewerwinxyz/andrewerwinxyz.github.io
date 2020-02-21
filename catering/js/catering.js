const parallax = document.querySelectorAll('.parallax');

window.onscroll = () =>
{
    let offset = window.pageYOffset;
        
    [].slice.call(parallax).forEach(e =>
    {
        let bgpos = "center " + (offset * 0.5) + "px";
        e.style.backgroundPosition = bgpos;
    });

};