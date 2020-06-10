var rule = CSSRulePlugin.getRule("span:after");
var timeline = gsap.timeline({ defaults: { duration: 1 } });

timeline
  .from(".stagger", {
    opacity: 0,
    duration: 1,
    y: -70,
    stagger: 0.3,
  })
  .to(rule, { duration: 1.8, cssRule: { scaleY: 0 } }, "-=2.2")
  .from(".bg-img", { backgroundPosition: "300px 0px", opacity: 0 }, "-=1.5")
  .from(".swirl-img", { y: 50, opacity: 0 });

document.getElementById("cta").addEventListener("click", () => {
  timeline.reversed() ? timeline.play() : timeline.reverse();
  setTimeout(() => {
    window.location.href =
      "https://www.google.com/maps/place/Floresta+Nacional+do+Iquiri/@-8.1714148,-66.8728525,6z/data=!4m5!3m4!1s0x9180a0bae40c85cb:0x91779c2c4ea787c0!8m2!3d-8.5429976!4d-66.2365723";
  }, 2200);
});
