/**
 * Seite zum Anzeigen des Menübaums.
 */
class PageFingerfood {
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
        let html = await fetch("page-fingerfood/page-fingerfood.html");
        let css = await fetch("page-fingerfood/page-fingerfood.css");

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

    let rezepte = await this._app.database.selectAllRezepte();
    let templateElement = document.querySelector("#template-rezept");
    let mainElement = document.querySelector("main");

    for (let i = 0; i < rezepte.length; i++) {
        let rezept = rezepte[i];

        if(rezept.kategorie == 1) {

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

    }//ENDIF
}// Ende FOR-Schleife
}// Ende Methode


}//Ende der Klasse
