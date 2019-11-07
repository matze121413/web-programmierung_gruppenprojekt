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
        this._readURL();
        // this.addRow();




    }//Ende show()

    async _readURL() {

        let url = window.location+"";
        let beginnID = url.indexOf("Detail2/");
        beginnID += 8;
        let endeID = url.length;
        let rezeptID = url.slice(beginnID, endeID);

    }


    async _showResults() {

    let rezepte = await this._app.database.selectAllRezepte();
    let templateElement = document.querySelector("#template-rezept");
    let mainElement = document.querySelector("main");


    for (let i = 0; i < rezepte.length; i++) {
        let rezept = rezepte[i];

        let url = window.location+"";
        let beginnID = url.indexOf("Detail2/");
        beginnID += 8;
        let endeID = url.length;
        let rezeptID = url.slice(beginnID, endeID);

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
        }

        //var zutaten = rezept.zutaten;
        //var zutatenTabelle = document.getElementsByTagName("table");

        //for(let j = 0; j < zutaten.length; j++) {
            /* alert(typeof zutatenTabelle);
            let tr = zutatenTabelle.insertRow(j+1);
            let td1 = document.createElement("td");
            td1.classList.add('td1');
            let td2 = document.createElement("td");
            td2.classList.add('td2');
            let td3 = document.createElement("td");
            td3.classList.add('td3');
            td1.innerHTML = '<input name="wertMenge" min="0" type="number" placeholder="rezept.zutaten.einheit" class="mengen"/>';
            td2.innerHTML = '<input name="wertEinheit" type="text" placeholder="rezept.zutaten.menge" class="einheiten"/>';
            td3.innerHTML = '<input name="wertZutat" type="text" placeholder="rezept.zutaten.zutatenName" class="zutaten"/>';
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);*/
        //}


        //HTML-Code zur Anzeige des Rezepts erzeugen
        let html = templateElement.innerHTML;
        html = html.replace(/{NAME}/g, rezept.name);
        html = html.replace(/{REZEPTID}/g, rezept.id);
        html = html.replace(/{BESCHREIBUNG}/g, rezept.beschreibung);
        html = html.replace(/{ZUBEREITUNGSZEIT}/g, rezept.zubereitungszeit);

        for(let j = 0; j < rezept.zutaten.length; j++) {
        let tr = document.getElementById("zutatenTabelle");
        let td1 = document.createElement("td");
        td1.classList.add('td1');
        html = html.replace(/{ZUTATENEINHEIT}/g, rezept.zutaten[j]['einheit']);
        document.getElementById("einblenden").appendChild(td1);

        let td2 = document.createElement("td");
        td2.classList.add('td2');
        html = html.replace(/{ZUTATENMENGE}/g, rezept.zutaten[j]['menge']);
        document.getElementById("einblenden").appendChild(td2);

        let td3 = document.createElement("td");
        td3.classList.add('td3');
        html = html.replace(/{ZUTATENNAME}/g, rezept.zutaten[j]['zutatenName']);
        document.getElementById("einblenden").appendChild(td3);
        }

        html = html.replace(/{IMAGE_URL}/g, imageUrl);
        mainElement.innerHTML += html;

    }//ENDIF
}// Ende FOR-Schleife
}// Ende Methode




}//Ende der Klasse
