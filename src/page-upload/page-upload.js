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
        datenLesenButton.addEventListener("click", ()=>this.getEverything());
        uploadButton.addEventListener("click", ()=>this.uploadDruck());
/*
        bildHochladen.addEventListener("change", function(e){
            var file = e.target.files[0];
            let storageRef= firebase.storage().ref('bilder/'+file.name);
            var task= storageRef.put(file);
        });*/
    }
    async getEverything(){
        let datenbank = new Database();
        let  rezepte = await datenbank.selectAllRezepte();
        alert(rezepte[0]["name"]);
    }
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
    deleteRow(){
        let rows = zutatenTabelle.getElementsByTagName("tr").length;
        if(rows>1)
        zutatenTabelle.deleteRow(rows-1);
    }
    uploadDruck(){
        let zutatenTabelle = document.querySelector("#zutatenTabelle");
        //let trs = zutatenTabelle.getElementsByTagName("tr");
        let zutaten = new Array();
        let korrekt=true;
         for (var i = 0, row; row = zutatenTabelle.rows[i]; i++){
            let inputFields = row.getElementsByTagName("INPUT");
            let  bildHochladen = document.getElementById("bildDatei");
            //alert(typeof(bildHochladen));
            try{
            var file= bildHochladen.files[0];
            var fileName = ""+Math.round(Math.random()*999999999);
            var storageRef= firebase.storage().ref('bilder/'+fileName);
        }catch(e){
            alert("Kein Bild hochgeladen!");
            korrekt=false;
        }
            let menge = inputFields[0].value;
            menge=parseFloat(menge);
            let einheit = inputFields[1].value;
            let zutatenName = inputFields[2].value;
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
            var kategorie = document.querySelectorAll('input[name="kategorieWert"]');
            if (kategorie[0].checked){
            let kategorie=1;
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
                let rezept = {
                    id: ""+Math.round(Math.random()*999999999),
                    bildId: fileName,
                    kategorie: kategorieValue,
                    name: name,
                    beschreibung: beschreibung,
                    portionen: portionen,
                    vegetarisch: gerichtsMerkmale[0].checked,
                    vegan: gerichtsMerkmale[1].checked,
                    glutenfrei: gerichtsMerkmale[2].checked,
                    laktosefrei: gerichtsMerkmale[3].checked,
                    zutaten: zutaten
            };
            let datenbank= new Database();
            datenbank.saveRezept(rezept);
            var task= storageRef.put(file);
            alert("Rezept wurde erfolgreich gespeichert.");
            }
            //var file = e.target.files[0];
            //firebase.storage().ref('bilder/'+file.name);
            //var task= storageRef.put(file);

        }else {
            alert("In der Beschreibung der Zutaten ist eine fehlende oder fehlerhafte Eingabe vorhanden!");
        }
    }
}
