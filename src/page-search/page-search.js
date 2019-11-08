/**
 * Seite zum Anzeigen des Menübaums.
 */
class PageSearch {
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
        let html = await fetch("page-search/page-search.html");
        let css = await fetch("page-search/page-search.css");

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


        this._app.setPageTitle("Suche", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageHeader(this._pageDom.querySelector("header"));
        this._app.setPageContent(this._pageDom.querySelector("main"));
        // Element für die Sucheleiste
        let suchElement= document.getElementById("suche");
        // ruft Methode auf sobald eine Taste auf der Tastatur gedrückt wurde
        suchElement.addEventListener("keyup", (event)=> this.nachNamenSuchen(event, suchElement));
    }
    async nachNamenSuchen(event, suchElement){
        // führt folgenden Code aus, sobald "Enter" gedrückt wird
        if(event.keyCode===13){
            // alle Rezepte aus der Datenbank holen
            let datenbank = new Database();
            let rezepte = await datenbank.selectAllRezepte();
            // Text aus der Suchleiste auslesen & in Großbuchstaben konvertieren
            let suche = suchElement.value.toUpperCase();
            var suchErgebnisse = [];
            //Schleift geht alle Rezepte in der Datenbank durch
            for(let i=0; i<rezepte.length; i++){
                // Rezeptnamen an Stelle i raussuchen & in Großbuchstaben konvertieren
                let rezeptName= rezepte[i]["name"];
                rezeptName= rezeptName.toUpperCase();
                // falls der Suchtext im Rezeptnamen entahlten ist (oder anders rum) wird das Rezept zu suchErgebnisse hinzugefügt
                if(rezeptName.includes(suche)||suche.includes(rezeptName)){
                suchErgebnisse.push(rezepte[i]);
                }
            }
            let templateElement = document.querySelector("#template-rezept");
            let mainElement = document.getElementById("anzeigenSuche");

            document.getElementById("suche").style.display = "none";
            document.getElementById("suchBegriff").style.display = "none";

            //ab hier wie Startseite etc.

            //neuer Button wird erzeugt
            let myBtn=document.createElement("button");
            myBtn.classList.add('btn');
            myBtn.innerHTML="zur Suche";
            document.getElementById("sucheLeiste").appendChild(myBtn);
            myBtn.addEventListener("click", () => {
            location.reload();
            });


            console.log();
            for (let i = 0; i < suchErgebnisse.length; i++) {
                let rezept = suchErgebnisse[i];
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
                html = html.replace(/{REZEPTID}/g, rezept.id);
                html = html.replace(/{IMAGE_URL}/g, imageUrl);

                mainElement.innerHTML += html;


        }
    }
    }

}//Ende der Klasse
