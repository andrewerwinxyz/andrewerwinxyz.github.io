const parallax = document.querySelectorAll('.parallax');

onscroll = () =>
{
    [].slice.call(parallax).forEach(e =>
    {
        e.style.backgroundPosition = "center "+(pageYOffset * 0.5)+"px";
    });
};