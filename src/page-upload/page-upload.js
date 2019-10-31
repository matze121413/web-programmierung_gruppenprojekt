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
        let bildHochladen = document.getElementById("bildDatei");
        zutatHinzufuegenButton.addEventListener("click", ()=>this.adRow());
        uploadButton.addEventListener("click", ()=>this.uploadDruck());
        /*
        bildHochladen.addEventListener("change", function(e){
            var file = e.target.files[0];
            firebase.storage().ref('bilder/'+file.name);
            var task= storageRef.put(file);
        });*/
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
    uploadDruck(){
        let zutatenTabelle = document.querySelector("#zutatenTabelle");
        //let trs = zutatenTabelle.getElementsByTagName("tr");
        let zutaten = new Array();
         for (var i = 0, row; row = zutatenTabelle.rows[i]; i++){
            let inputFields = row.getElementsByTagName("INPUT");
            //let tds = trs.getElementsByTagName("td");
            //let menge=tds[0];
            let menge = inputFields[0].value;
            let einheit = inputFields[1].value;
            let zutatenName = inputFields[2].value;
            let zutat = {
                menge: menge,
                einheit: einheit,
                zutatenName: zutatenName
            }
            zutaten.push(zutat);
        }
        let gerichtsMerkmale = document.querySelectorAll('input[name="merkmale"]');
        let rezept = {
                id: ""+Math.round(Math.random()*999999999),
                name: document.getElementById("rezeptName").value,
                beschreibung: document.getElementById("beschreibung").value,
                vegetarisch: gerichtsMerkmale[0].checked,
                vegan: gerichtsMerkmale[1].checked,
                glutenfrei: gerichtsMerkmale[2].checked,
                laktosefrei: gerichtsMerkmale[3].checked,
                zutaten: zutaten
            };
            let datenbank= new Database();
            datenbank.saveRezept(rezept);
            //let task = storageRef.put(file);
            //let rezepte = datenbank.selectAllRezepte();
            //alert(rezepte[0]["id"]);
        }
}
