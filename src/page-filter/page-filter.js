/**
 * Seite zum Ändern der Kochzeit.
 */
class PageFilter {
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
        let html = await fetch("page-filter/page-filter.html");
        let css = await fetch("page-filter/page-filter.css");

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

        //Hier werden die Elemente aus der html-Seite "geholt"
        let sliderElement = this._pageDom.querySelector("#myRange");
        let kochzeitElement = this._pageDom.querySelector("#kochzeit");
        let btnShowElement= this._pageDom.querySelector("#myResults");
        let cbElements= this._pageDom.querySelectorAll(".checks");
        let labelElement= this._pageDom.querySelector("anzeigen");

        sliderElement.addEventListener("change", () => this._onRangeChanged(sliderElement, kochzeitElement));
        //Methode soll ausgeführt werden, damit beim Laden der Filter-Page ein default-Wert angezeigt wird
        this._onRangeChanged(sliderElement, kochzeitElement);

        btnShowElement.addEventListener("click", () => this._getValue(cbElements, kochzeitElement, labelElement));

        this._app.setPageTitle("Filter", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageHeader(this._pageDom.querySelector("header"));
        this._app.setPageContent(this._pageDom.querySelector("main"));
    }

    //Methode, die Kochzeit ändert, wenn Slider verschoben wird
    _onRangeChanged(sliderElement, kochzeitElement) {
        let minuten = sliderElement.value;

        if (minuten == 1) {
            kochzeitElement.textContent = `${minuten} Minute`;
        } else {
            kochzeitElement.textContent = `${minuten} Minuten`;
        }
    }//Ende Methode


    //Mit Klick auf Button "Ergebnisse anzeigen, sollen die Werte die zuvor ausgewählt wurden ausgelesen werden (Basis, um später mit Werten aus Datenbank zu vergleichen)"
    _getValue(cbElements, kochzeitElement, labelElement){
        let values=[];
        let minuten = kochzeitElement.innerHTML; //ausgewählte Kochzeit "holen"
        let text= minuten + " " + values;

        cbElements.forEach(cbElements => {
            if (cbElements.checked) {
                values.push(cbElements.value);
            }//Ende if
}           );

    //let datenbank = new Database();
    //let  rezepte = await datenbank.selectAllRezepte();
    //for(i=0; i<rezepte.length; i++){
    //if(rezepte[i]["glutenfrei"]==values[0]||rezept.glutenfrei[i]==values[1]||rezept.glutenfrei[i]==values[2]||rezept.glutenfrei[i]==values[3]){
    //lableElement.innerHTML= rezept[i]["name"];
//}//if
    //if(rezept.zubereitungszeit)
//}//for

        //alert(minuten + " " + values);
}



}//Ende der Klasse
