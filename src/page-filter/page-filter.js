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

        //Variablen-Deklaration
        let values=[];
        let minuten = kochzeitElement.innerHTML; //ausgewählte Kochzeit "holen"
        let i;
        let j;
        let veggi;
        let lakto;
        let glute;
        let vega;

        //Es wird ausgelesen welche Eigenschaften des Filters selektiert wurden und diese sollen in die Array values gespeichert werden
        cbElements.forEach(cbElements => {
            if (cbElements.checked) {
                values.push(cbElements.value);
            }//Ende if
}           );//Ende forEach

    //Beim Button-Click sollen die Elemente des filters ausgeblendet werden
    document.getElementById("myCheckBox").style.display = "none";
    document.getElementById("mySlider").style.display = "none";
    document.getElementById("myResults").style.display = "none";
    let myBtn=document.createElement("button");
    myBtn.innerHTML="Filter überarbeiten";
    document.getElementById("einblenden").appendChild(myBtn);

    //Hier fehlt noch, dass die Elemente wieder aus der page-filter angezeigt werden wenn auf den myBtn gecklickt Wird
    myBtn.addEventListener("click", () => this._einblenden());

    //Datenbank-Objekt Erzeugung
    let datenbank = new Database();
    let rezepte = await datenbank.selectAllRezepte();

    //Array values wird durchgegangen und überprüft welche ausgewählt wurden damit ein boolean-Flag gesetzt werden kann.
    //Diese flags sind notwendig, damit man die boolean-Werte mit den ausgewählten Eigenschaften aus der page-Filter vergeleichen kann
    for(i=0; i<=values.length; i++){

        if(values[i]=="vegetarisch"){
            veggi = true;
        }//Ende if-Anweisung

        if(values[i]=="laktosefrei"){
            lakto = true;
        }//Ende if-Anweisung

        if(values[i]=="glutenfrei"){
            glute = true;
        }//Ende if-Anweisung

        if(values[i]=="vegan"){
            vega = true;
        }//Ende if-Anweisung

        //Wenn Array durchgegangen wurde (i=values.length), sollen am Ende die flags wieder auf false gesetzt werden.
        if(i==values.length){
            let veggi=false;
            let lakto=false;
            let glute=false;
            let vega=false;
        }//Ende if-Anweisung
    }//Ende for-Schleife

        //NUn wird hier die rezepte Array durchlaufen
        for(j=0; j<rezepte.length; j++){

            //es wird geprüft welche flags==true sind und welche Zubereitungszeit gesetzt worden ist, wenn etwas true ist, geht man in die if-Anweisung
            //und es wird ein neues html-Element h4 erzeugt. In dieses Element wird der Rezeptname geschrieben, und das html-Element wird dem div-Element
            //"einblenden" untergeordnet mit appendChild
            if(rezepte[j]["glutenfrei"]==glute || rezepte[j]["vegetarisch"]==veggi ||  rezepte[j]["vegan"]==vega ||  rezepte[j]["laktosefrei"]==lakto && rezepte[j]["zubereitungszeit"] <= minuten ){

                let rezeptname=document.createElement("h4");
                rezeptname.innerHTML=rezepte[j]["name"];
                document.getElementById("einblenden").appendChild(rezeptname);
            }//if

        }//Ende for-Schleife
            //if(rezepte[j]["vegetarisch"]==veggi){

                //let rezeptname=document.createElement("h4");
                //rezeptname.innerHTML=rezepte[j]["name"];
                //document.getElementById("einblenden").appendChild(rezeptname);

                    //labelElement.innerHTML= rezept[i]["name"];
            //}//if


//if(rezepte[i]["laktosefrei"]==values[j]){
//labelElement.innerHTML= rezept[i]["name"];
//}//if
//(rezepte[i]["vegan"]==values[j]){
    //labelElement.innerHTML= rezept[i]["name"];
//}//if
//(rezepte[i]["vegetarisch"]==values[j]){
    //labelElement.innerHTML= rezept[i]["name"];
//}//if
//if(rezepte[i]["zubereitungszeit"]<= minuten){
//labelElement.innerHTML= rezept[i]["name"];
//}
            //}//innere for-Schleife



        //alert(text);

        //let myMain = document.getElementsByTagName("main");
        //let rezeptname = document.createElement("h4");
        //rezeptname.innerHTML= rezepte [0]["name"];
        //document.getElementById("einblenden").appendChild(rezeptname);

        //labelElement.innerHTML= rezepte[5]["name"];
        //window.location.href="#/FilterErgebnis/";
}//Ende MEthode

//Methode zum Neuladen der page-filter Seite
_einblenden(){
location.reload();
}

}//Ende der Klasse
