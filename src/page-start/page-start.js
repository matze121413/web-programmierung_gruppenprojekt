"use strict";

/**
 * Klasse PageStart: Startseite der App
 */
class PageStart {
    /**
     * Konstruktor
     * @param {App} app Zentrale Instanz der App-Klasse
     */
    constructor(app) {
        this._app = app;
    }

    /**
     * Seite anzeigen. Wird von der App-Klasse aufgerufen.
     */
    async show() {
        // Anzuzeigenden Seiteninhalt nachladen
        let html = await fetch("page-start/page-start.html");
        let css = await fetch("page-start/page-start.css");

        if (html.ok && css.ok) {
            html = await html.text();
            css = await css.text();
        } else {
            console.error("Fehler beim Laden des HTML/CSS-Inhalts");
            return;
        }

        // Seite zur Anzeige bringen
        this._pageDom = document.createElement("div");
        this._pageDom.innerHTML = html;

        await this._renderReciepts(this._pageDom);

        this._app.setPageTitle("Startseite", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageHeader(this._pageDom.querySelector("header"));
        this._app.setPageContent(this._pageDom.querySelector("main"));

        this._countDown();
        this._goToPageDetail();
    }

    _countDown() {
        var christmas = new Date("Dec 24, 2019 00:00:00").getTime();

        var x = setInterval(function() {

          var today = new Date().getTime();

          var timeLeft = christmas - today;

          var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          document.getElementById("countDown").innerHTML = days + "d " + hours + "h "
          + minutes + "m " + seconds + "s ";

          if (timeLeft < 0) {
            clearInterval(x);
            document.getElementById("countDown").innerHTML = "EXPIRED";
          }
        }, 1000);
    }

    async _renderReciepts(pageDom) {
        let rezepte = await this._app.database.selectAllRezepte();
        let templateElement = pageDom.querySelector("#template-rezept");
        let mainElement = pageDom.querySelector("main");

        for (let i = 0; i < rezepte.length; i++) {
            let rezept = rezepte[i];

            // URL des Bilds ermitteln
            let imageUrl = "default.jpg";

            if (rezept.bildId) {
                try {
                    imageUrl = await this._app.database.getBildUrl(rezept.bildId);
                } catch (error) {
                    console.error(error);
                    imageUrl = "default.jpg";
                }
            }

            // HTML-Code zur Anzeige des Rezepts erzeugen
            let html = templateElement.innerHTML;
            html = html.replace(/{NAME}/g, rezept.name);
            html = html.replace(/{IMAGE_URL}/g, imageUrl);
            mainElement.innerHTML += html;
        }
    }

    async _goToPageDetail() {
        document.getElementById("bildMitLink").addEventListener("click", function(){
            window.location.href = "#/Detail/";
        });
    }
}
