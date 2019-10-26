class App {

    //// Funktionert so nicht!
    // database = new Database();
    // halloString = "Hallo, Welt";

    constructor() {
        this.database = new Database();
    }

    run() {
        // Klick auf das Hamburger-Menu abfangen
        let menuIcon = document.querySelector("header nav .toggle-menu a");
        menuIcon.addEventListener("click", this.toggleHamburgerMenu);

        // Klick auf den Zurück-Pfeil abfangen
        let backIcon = document.querySelector("header nav .go-back a");
        backIcon.addEventListener("click", () => window.history.back());

        // Inhalt der ersten Seite anzeigen
        let page = new PageOverview(this);
        page.show();
    }

    toggleHamburgerMenu() {
        // Menü ein- oder ausblenden
        let menuList = document.querySelector("header nav .menu-right");

        if (menuList.classList.contains("small-screen-hidden")) {
            menuList.classList.remove("small-screen-hidden");
        } else {
            menuList.classList.add("small-screen-hidden");
        }
    }

    countDown() {
    var countDownDate = new Date("Dec 24, 2019, 00:00:00").getTime();
    var x = setInterval(function() {
      var now = new Date().getTime();
      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(x);
        return "EXPIRED";
      }

      return (days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

    }, 1000);
  }

}
