/**
 * Seite zum Anzeigen des Menübaums.
 */
class PageHauptspeise {
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
        let html = await fetch("page-hauptspeise/page-hauptspeise.html");
        let css = await fetch("page-hauptspeise/page-hauptspeise.css");

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


        this._app.setPageTitle("Menu", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageHeader(this._pageDom.querySelector("header"));
        this._app.setPageContent(this._pageDom.querySelector("main"));

        this._showResults();




    }//Ende show()




    async _showResults() {
        var datenbank = new Database();
        var rezepte = await datenbank.selectAllRezepte();
        var i;

        for(i=0; i<rezepte.length; i++){

            if(rezepte[i]["kategorie"]==6) {

            let rezeptname = document.createElement("h4");
            rezeptname.innerHTML = rezepte[i]["name"];
            document.getElementById("einblenden").appendChild(rezeptname);
        }//Ende if
    } //Ende for-Schleife
    }


}//Ende der Klasse
