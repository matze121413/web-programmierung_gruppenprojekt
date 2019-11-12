/**
 * Seite zum Anzeigen des Menübaums.
 */
class PageDetail2 {
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
        let html = await fetch("page-detail2/page-detail2.html");
        let css = await fetch("page-detail2/page-detail2.css");

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
    let mainElement = document.querySelector("main");


        // URL auslesen
        let url = window.location+"";

        /* URL so zuschneiden, dass nur noch der Wert hinter dem letzten Slash
        betrachtet wird -> enthält die Rezept-ID */
        let beginnID = url.indexOf("Detail2/");
        beginnID += 8;
        let endeID = url.length;
        let rezeptID = url.slice(beginnID, endeID);

        var rezept;
        for (let i = 0; i < rezepte.length; i++) {
            if(rezepte[i]["id"]==rezeptID){
                rezept= rezepte[i];
            }
        }

        // nur die Rezepte anzeigen, deren Rezept-ID zutrifft
        if(rezept.id == rezeptID) {

        // URL des Bilds ermitteln
        let imageUrl = "default.jpg";

        if (rezept.bildId) {
            try {
                imageUrl = await this._app.database.getBildUrl(rezept.bildId);
            } catch (error) {
                console.error(error);
                imageUrl = "default.jpg";
            }
        } // Ende if(rezept.bildId)

        //HTML-Code zur Anzeige des Rezepts erzeugen
        let einblendenElement = document.getElementById("einblenden");
        let html = einblenden.innerHTML;
        html = html.replace(/{NAME}/g, rezept.name);
        /* Rezept-ID für die Übergabe an die Seite page-detail2 erzeugen, damit diese
        in den bei Klick auf das Bild aufgerufenen Link geschrieben werden kann */
        html = html.replace(/{REZEPTID}/g, rezept.id);
        html = html.replace(/{BESCHREIBUNG}/g, rezept.beschreibung);
        html = html.replace(/{ZUBEREITUNGSZEIT}/g, rezept.zubereitungszeit);

        html = html.replace(/{IMAGE_URL}/g, imageUrl);
        mainElement.innerHTML += html;
    } // Ende if(rezept.id == rezeptID)

        /* Array Zutaten durchlaufen und für jeden Durchlauf
        neue HTML-Elemente zur Anzeige erzeugen */
        var zutaten = rezept["zutaten"];
        var tabelle= document.getElementById("zutatenTabelle");
        for(let j = 0; j < zutaten.length; j++) {
            let tr = tabelle.insertRow(j+1);
            let td1 = document.createElement("td");
            td1.classList.add('td1');
            let td2 = document.createElement("td");
            td2.classList.add('td2');
            let td3 = document.createElement("td");
            td3.classList.add('td3');
            td1.innerHTML =zutaten[j]["menge"];
            td2.innerHTML = zutaten [j]["einheit"];
            td3.innerHTML = zutaten[j]["zutatenName"];
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
        } // Ende for-Schleife

} // Ende _showResults()

}//Ende der Klasse
