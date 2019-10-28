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

        let sliderElement = this._pageDom.querySelector("#myRange");
        let kochzeitElement = this._pageDom.querySelector("#kochzeit");
        sliderElement.addEventListener("change", () => this._onRangeChanged(sliderElement, kochzeitElement));
        this._onRangeChanged(sliderElement, kochzeitElement);

        this._app.setPageTitle("Kochzeit einstellen", {isSubPage: true});
        this._app.setPageCss(css);
        this._app.setPageHeader(this._pageDom.querySelector("header"));
        this._app.setPageContent(this._pageDom.querySelector("main"));
    }

    _onRangeChanged(sliderElement, kochzeitElement) {
        let minuten = sliderElement.value;

        if (minuten == 1) {
            kochzeitElement.textContent = `${minuten} Minute`;
        } else {
            kochzeitElement.textContent = `${minuten} Minuten`;
        }
    }
}


/*
var slider = document.getElementById("myRange");
var output = document.getElementById("kochzeit");

output.innerHTML = slider.kochzeit;
slider.oninput = function() {
    output.innerHTML= this.kochzeit;
}
*/
