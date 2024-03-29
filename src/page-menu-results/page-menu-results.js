"use strict";

/**
 * Klasse PageStart: Startseite der App
 */
class PageMenuResults {
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
        let html = await fetch("page-menu-results/page-menu-results.html");
        let css = await fetch("page-menu-results/page-menu-results.css");

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

    }

    async _renderReciepts(pageDom) {
        let rezepte = await this._app.database.selectAllRezepte();
        let templateElement = pageDom.querySelector("#template-rezept");
        let mainElement = pageDom.querySelector("main");

        /* URL auswerten und so zuschneiden, dass nur noch der Wert hinter dem letzten Slash
        betrachtet wird -> enthält die Rezeptkategorie */
        let url = window.location+"";
        let beginnID = url.indexOf("PageMenuResults/");
        beginnID += 16;
        let endeID = url.length;
        let kategorie = url.slice(beginnID, endeID);


        for (let i = 0; i < rezepte.length; i++) {
            let rezept = rezepte[i];

            /* in der URL hinter dem letzten Slash übergebenen String auswerten
            und den dazugehörigen Werten der Datenbank zuordnen */
            switch(kategorie) {
                case "Fingerfood":
                kategorie = 1;
                break;
                case "Kuchen":
                kategorie = 2;
                break;
                case "Vorspeise":
                kategorie = 3;
                break;
                case "Plaetzchen":
                kategorie = 4;
                break;
                case "Hauptspeise":
                kategorie = 5;
                break;
                case "Dessert":
                kategorie = 6;
                break;
            }

            // nur die Rezepte anzeigen, deren Kategorie zutrifft
            if(rezept.kategorie == kategorie){

            // URL des Bilds ermitteln
            let imageUrl = "default.jpg";

            if (rezept.bildId) {
                try {
                    imageUrl = await this._app.database.getBildUrl(rezept.bildId);
                } catch (error) {
                    console.error(error);
                    imageUrl = "default.jpg";
                }


            // HTML-Code zur Anzeige des Rezepts erzeugen
            let html = templateElement.innerHTML;
            html = html.replace(/{NAME}/g, rezept.name);
            /* Rezept-ID für die Übergabe an die Seite page-detail2 erzeugen, damit diese
            in den bei Klick auf das Bild aufgerufenen Link geschrieben werden kann */
            html = html.replace(/{REZEPTID}/g, rezept.id);
            html = html.replace(/{IMAGE_URL}/g, imageUrl);
            mainElement.innerHTML += html;

        } // Ende if (rezept.bildId)
    } // Ende if(rezept.kategorie == kategorie)

} // Ende for-Schleife über alle Rezepte

} // Ende Methode

} // Ende der Klasse
