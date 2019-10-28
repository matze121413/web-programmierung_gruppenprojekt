/**
 * Seite zum Ändern der Kochzeit.
 */
class PageUpload {
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
        let html = await fetch("page-upload/page-upload.html");
        let css = await fetch("page-upload/page-upload.css");

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



        this._app.setPageTitle("Rezepte hochladen", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageHeader(this._pageDom.querySelector("header"));
        this._app.setPageContent(this._pageDom.querySelector("main"));

        let zutatenTabelle = this._pageDom.querySelector("#zutatenTabelle");
        let zutatHinzufuegenButton = document.getElementById("hinzufuegen-button");
        zutatHinzufuegenButton.addEventListener("click", ()=>this.adRow());
    }
    adRow(){
        let rows = zutatenTabelle.getElementsByTagName("tr").length;
        let tr = zutatenTabelle.insertRow(rows);
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        td1.innerHTML = '<input name="wertMenge" type="number" placeholder="5" />';
        td2.innerHTML = '<input name="wertEinheit" type="text" placeholder="gramm" />';
        td3.innerHTML = '<input name="wertZutat" type="text" placeholder="Mehl" />';
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

    }
}
