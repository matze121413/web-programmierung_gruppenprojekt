
class PageFilterErgebnis {
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
       let html = await fetch("page-filter-ergebnis/page-filter-ergebnis.html");
       let css = await fetch("page-filter-ergebnis/page-filter-ergebnis.css");

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

       this._app.setPageTitle("FilterErgebnis", {isSubPage: true});
       this._app.setPageCss(css);
       this._app.setPageHeader(this._pageDom.querySelector("header"));
       this._app.setPageContent(this._pageDom.querySelector("main"));
   }

   }