// AOS (Animate On Scroll) configuration
export const initAOS = () => {
  if (typeof window !== "undefined") {
    import("aos").then((AOS) => {
      AOS.default.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false,
        offset: 100,
        delay: 0,
        anchorPlacement: "top-bottom",
      })
    })
  }
}

export const refreshAOS = () => {
  if (typeof window !== "undefined") {
    import("aos").then((AOS) => {
      AOS.default.refresh()
    })
  }
}
