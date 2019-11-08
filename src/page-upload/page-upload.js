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

// erzeugen aller relevanter Felder
        let zutatenTabelle = this._pageDom.querySelector("#zutatenTabelle");
        let rezeptname =  this._pageDom.querySelector("rezeptName");
        let gerichtsMerkmale = this._pageDom.querySelectorAll('input[name="merkmale"]');
        let beschreibungZubereitung = document.getElementById("beschreibung");
        let uploadButton = document.getElementById("upload");
        let zutatHinzufuegenButton = document.getElementById("hinzufuegen-button");
        let datenLesenButton = document.getElementById("test-button");
        let zutatEntfernenButton = document.getElementById("entfernen-button");
        let bildHochladen = document.getElementById("bildDatei");
        zutatHinzufuegenButton.addEventListener("click", ()=>this.adRow());
        zutatEntfernenButton.addEventListener("click", ()=>this.deleteRow());
        uploadButton.addEventListener("click", ()=>this.uploadDruck());
}
    // Methode, um Tabelle eine Zeile in der Tabelle hinzuzufügen
    adRow(){
        let rows = zutatenTabelle.getElementsByTagName("tr").length;
        let tr = zutatenTabelle.insertRow(rows);
        let td1 = document.createElement("td");
        td1.classList.add('td1');
        let td2 = document.createElement("td");
        td2.classList.add('td2');
        let td3 = document.createElement("td");
        td3.classList.add('td3');
        td1.innerHTML = '<input name="wertMenge" min="0" type="number" placeholder="5" class="mengen"/>';
        td2.innerHTML = '<input name="wertEinheit" type="text" placeholder="gramm" class="einheiten"/>';
        td3.innerHTML = '<input name="wertZutat" type="text" placeholder="Mehl" class="zutaten"/>';
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
    }
    // Methode, um der Tabelle die letzte Zeile zu löschen
    deleteRow(){
        let rows = zutatenTabelle.getElementsByTagName("tr").length;
        if(rows>1)
        zutatenTabelle.deleteRow(rows-1);
    }
    /*
    Methode, welche ausgeführt wird, sobald der Button "Upload" gedrückt wird.
    Zunächst werden die Felder ausgelesen. Dann werden die Inhalte geprüft.
    Daraufhin werden die Daten zu einem Objekt "Rezept" zusammengefasst.
    Zuletzt wird das Bild an den Storage und das "Rezept" an die Datenbank geschickt.
    */
    uploadDruck(){
        let zutatenTabelle = document.querySelector("#zutatenTabelle");
        //let trs = zutatenTabelle.getElementsByTagName("tr");
        let zutaten = new Array();
        let korrekt=true;
        let zubereitungszeit= document.getElementById("vorbereitungsZeitValue").value;
        zubereitungszeit= parseInt(zubereitungszeit);
        //Prüfen, ob ZUBEREITUNGSZEIT einer Nummer entspricht
        if(isNaN(zubereitungszeit)){
            alert("Die Zuberetungszeit ist nicht korrekt angegeben!");
            return;
        }
        let  bildHochladen = document.getElementById("bildDatei");
        // Prüfen, ob Bild hochgeladen wurde. Falls ja, dem File eine zufällige 9stellige Nummer als Namen geben
        //Anmerkung: theoretisch möglich, dass 2 gleich benannte Bilder hochgeladen werden, aber deutlich unwahrscheinlicher,
        // als wenn User selbst Namen vergeben könnte
        try{
        var file= bildHochladen.files[0];
        var fileName = ""+Math.round(Math.random()*999999999);
        var storageRef= firebase.storage().ref('bilder/'+fileName);
    }catch(e){
        alert("Kein Bild hochgeladen!");
        korrekt=false;
    }
        // Zutaten-Tabelle auslesen und in einem Array "Zutaten" speichern.
        //Jede Zutat ist ein Dictionary aus "menge", "einheit" und "zutatenName"
         for (var i = 0, row; row = zutatenTabelle.rows[i]; i++){
            let inputFields = row.getElementsByTagName("INPUT");

            let menge = inputFields[0].value;
            menge=parseFloat(menge);
            let einheit = inputFields[1].value;
            let zutatenName = inputFields[2].value;
            //Prüfen auf leere Felder und, ob "menge" eine Nummer ist
            if(isNaN(menge) || !einheit.length || !zutatenName.length){
                korrekt=false;
            }

            let zutat = {
                menge: menge,
                einheit: einheit,
                zutatenName: zutatenName
            }
            zutaten.push(zutat);
        }
        if(korrekt){
            let name = document.getElementById("rezeptName").value;
            let beschreibung= document.getElementById("beschreibung").value;
            let portionen = document.getElementById("portionenEingabe").value;
            portionen = parseFloat(portionen);
            if(!name.length || !beschreibung.length || isNaN(portionen)){
                korrekt=false;
                alert("Rezeptname, Beschreingung und Portionenangabe müssen korrekt angegeben werden!");
            }
            // prüfen, in welche Kategorie Rezept gehört ( Fingerfood etc.)
            var kategorie = document.querySelectorAll('input[name="kategorieWert"]');
            if (kategorie[0].checked){
            var kategorieValue=1;
        }
            else if(kategorie[1].checked){
            var kategorieValue=2;
        }
            else if(kategorie[2].checked){
            var kategorieValue=3;
        }
            else if(kategorie[3].checked){
            var kategorieValue=4;
        }
            else if(kategorie[4].checked){
            var kategorieValue=5;
        }
            else if(kategorie[5].checked){
            var kategorieValue=6;
        }
            else{
                alert("Keine Kategorie ausgewählt!");
                return;
            }
            if(korrekt){
            let gerichtsMerkmale = document.querySelectorAll('input[name="merkmale"]');
            //Dictionary Rezept erstellen
                let rezept = {
                    id: ""+Math.round(Math.random()*999999999),
                    bildId: fileName,
                    kategorie: kategorieValue,
                    name: name,
                    zubereitungszeit: zubereitungszeit,
                    beschreibung: beschreibung,
                    portionen: portionen,
                    //zuweisen, ob Gerichtsmerkmale zutreffen
                    vegetarisch: gerichtsMerkmale[0].checked,
                    vegan: gerichtsMerkmale[1].checked,
                    glutenfrei: gerichtsMerkmale[2].checked,
                    laktosefrei: gerichtsMerkmale[3].checked,
                    zutaten: zutaten
            };
            // Rezept in Datenbank speichern
            let datenbank= new Database();
            datenbank.saveRezept(rezept);
            // Bild in Storage hochladen
            storageRef.put(file).then(function(snapshot){
                // sobald Bild erfolgeich hochgeladen wurde -> Seite neu laden
                console.log('Bild ist wurde erfolgreich hochgeladen!');
                location.reload();
            });

            }
        }else {
            alert("In der Beschreibung der Zutaten ist eine fehlende oder fehlerhafte Eingabe vorhanden!");
        }
    }
}
