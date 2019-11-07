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
        let suchElement= document.getElementById("suche");
        suchElement.addEventListener("keyup", (event)=> this.nachNamenSuchen(event, suchElement));
    }
    async nachNamenSuchen(event, suchElement){
        if(event.keyCode===13){
            let datenbank = new Database();
            //Rezepte in rezepte-Array speichern
            let rezepte = await datenbank.selectAllRezepte();
            let suche = suchElement.value.toUpperCase();
            var suchErgebnisse = [];
            for(let i=0; i<rezepte.length; i++){
                let rezeptName= rezepte[i]["name"];
                rezeptName= rezeptName.toUpperCase();
                if(rezeptName.includes(suche)||suche.includes(rezeptName)){
                suchErgebnisse.push(rezepte[i]);
                }
            }
            let templateElement = document.querySelector("#template-rezept");
            let mainElement = document.getElementById("anzeigenSuche");

            document.getElementById("suche").style.display = "none";
            document.getElementById("suchBegriff").style.display = "none";

            //neuer bUtton wird erzeugt
            let myBtn=document.createElement("button");
            myBtn.classList.add('btn');
            myBtn.innerHTML="zur Suche";
            document.getElementById("sucheLeiste").appendChild(myBtn);
            myBtn.addEventListener("click", () => {
            location.reload();
            });
            /*
            mainElement.removeChild(templateElement);
            templateElement = document.createElement("template");
            templateElement.id = "template-rezept";
            let divElement = document.createElement("div");
            divElement.classList.add("rezept");
            divElement.innerHTML="{NAME}";
            let aElement = document.createElement("a");
            aElement.href= "#/Detail2/{REZEPTID}";
            let imgElement= document.createElement("img");
            imgElement.src="{IMAGE_URL}";
            imgElement.alt="{NAME}";
            imgElement= aElement.appendChild(imgElement);
            aElement=divElement.appendChild(aElement);
            divElement=templateElement.appendChild(divElement);
            templateElement= mainElement.appendChild(templateElement);
*/


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

            //ENDIF
        }
    }
    }

}//Ende der Klasse
