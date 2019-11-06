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

        sliderElement.addEventListener("change", () => this._onRangeChanged(sliderElement, kochzeitElement));
        //Methode soll ausgeführt werden, damit beim Laden der Filter-Page ein default-Wert angezeigt wird
        this._onRangeChanged(sliderElement, kochzeitElement);

        btnShowElement.addEventListener("click", () => this._getValue(cbElements, kochzeitElement));

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
async  _getValue(cbElements, kochzeitElement){

    //Datenbank-Objekt Erzeugung
    let datenbank = new Database();
    //Rezepte in rezepte-Array speichern
    let rezepte = await datenbank.selectAllRezepte();
    //Variablen-Deklaration
    let minuten = kochzeitElement.innerHTML; //ausgewählte Kochzeit "holen"
    let min = parseInt(minuten);


    //Definition von Funktionen, die zurückgeben, ob ein Rezept eine gewisse Kategorie erfüllt
    function checkVegetarisch(rezept){
    return rezept["vegetarisch"]==true;
    }
    function checkVegan(rezept){
        return rezept["vegan"]==true;
    }
    function checkGlutenfrei(rezept){
        return rezept["glutenfrei"]==true;
    }
    function checkLaktosefrei(rezept){
        return rezept["laktosefrei"]==true;
    }

    //rezepte-Array auf das filtern, was Anwender im Filter ausgewählt hat an GErichtseigenschaften
    if(cbElements[0].checked){
        var veggirezepte = rezepte.filter(checkVegetarisch);
    }else{
        var veggirezepte=rezepte;
    }
    if(cbElements[1].checked){
        var veganrezepte= veggirezepte.filter(checkVegan);
    }else{
        var veganrezepte=veggirezepte;
    }
    if(cbElements[2].checked){
        var glutenfreirezepte= veganrezepte.filter(checkGlutenfrei);
    }else{
        var glutenfreirezepte=veganrezepte;
    }
    if(cbElements[3].checked){
        var laktosefreirezepte= glutenfreirezepte.filter(checkLaktosefrei);
    }else{
        var laktosefreirezepte= glutenfreirezepte;
    }

    //laktosefrei entspricht dem Stand dass nach allen vom Nutzer ausgewählten Checks gefiltert wurde.
    //Bedeutet man kann in jedem Fall mit laktosefrei weiterarbeiten
    //Rezepte aus der laktosefreirezepte-array auf page-filter ausgeben und dabei prüfen, ob die Zubereitungszeit des Rezepts aus der laktoserezepte-Array
    //mit der angegebenen Zuberetungszeit aus der page-Filter übereinstimmt
    if(min<=1){
       alert("Die Zubereitungszeit ist kürzer als eine Minute.Überprüfen sie Ihre Zeitangabe");
    }

    for(let i=0; i<laktosefreirezepte.length; i++){
          if(laktosefreirezepte[i]["zubereitungszeit"]<= min){
              let rezeptname=document.createElement("h4");
              rezeptname.innerHTML=laktosefreirezepte[i]["name"];
              document.getElementById("einblenden").appendChild(rezeptname);
          }//Ende if
    }//Ende for

    //Beim Button-Click sollen die Elemente des filters ausgeblendet werden
    document.getElementById("myCheckBox").style.display = "none";
    document.getElementById("mySlider").style.display = "none";
    document.getElementById("myResults").style.display = "none";
    document.getElementById("i").style.display="none";
    document.getElementById("name").style.display="none";

    //neuer bUtton wird erzeugt
    let myBtn=document.createElement("button");
    myBtn.classList.add('btn');
    myBtn.innerHTML="Filter überarbeiten";
    document.getElementById("hallo").appendChild(myBtn);

    //Beim Button-click auf myBtn, soll die page-Filter neu geladen werden
    myBtn.addEventListener("click", () => this._einblenden());
}//Ende Funktion

//Methode zum Neuladen der page-filter Seite
_einblenden(){
location.reload();
}//Ende Funktion

}//Ende der Klasse
