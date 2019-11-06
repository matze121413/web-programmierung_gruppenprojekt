"use strict";

/**
 * Klasse Database: Kümmert sich um die Datenhaltung der App
 *
 * Diese Klasse beinhaltet alle Datensätze der App. Entgegen dem Namen handelt
 * es sich nicht wirklich um eine Datenbank, da sie lediglich ein paar statische
 * Testdaten enthält. Ausgefeilte Methoden zum Durchsuchen, Ändern oder Löschen
 * der Daten fehlen komplett, könnten aber in einer echten Anwendung relativ
 * einfach hinzugefügt werden.
 */

class Database {

    /**
     * Konstruktor.
    */
    constructor() {
        if(!firebase.apps.length){
            firebase.initializeApp({
               apiKey: "AIzaSyBzKdqeKSox2ru4vpwcKKrDs-CZo-Xt1zI",
               authDomain: "webprogrammierungfrsama.firebaseapp.com",
               databaseURL: "https://webprogrammierungfrsama.firebaseio.com",
               projectId: "webprogrammierungfrsama",
               storageBucket: "webprogrammierungfrsama.appspot.com",
               messagingSenderId: "838269787762",
               appId: "1:838269787762:web:e1d1d28ec1ad0bae162ceb"
            });
        }

        // Initialize Firebase
        // firebase.initializeApp(firebaseConfig);
        this._db = firebase.firestore();
        this._storage = firebase.storage().ref();
        this._rezepte=this._db.collection("rezepte");
    }

     saveRezept(rezept){
          this._rezepte.doc(rezept.id).set(rezept);
        //this._rezepte.doc(rezept["id"]).set(rezept);
    }
    /*
    bildHochladen(file){
        let storageRef= firebase.storage().ref('bilder/'+file.name);
        storageRef.put(file);
    }
    */
    async selectAllRezepte() {
        let result = await this._rezepte.orderBy("name").get();
        let rezepte = [];
        //alert(typeof(result[0]["id"]));
        result.forEach(entry => {
            let rezept = entry.data();
            rezepte.push(rezept);
        });
        return rezepte;
    }

    async getBildUrl(bildId) {
        return await this._storage.child(`bilder/bildId[${bildId}].jpg`).getDownloadURL();
    }

    /* let result = this._rezepte.orderBy("name").get();
    alert(typeof(result[0]));
     let rezepte = [];
     //alert(typeof(result[0]["id"]));
     result.forEach(entry => {
         let rezept = entry.data();
         rezepte.push(rezept);
     });
     return rezepte;
    */

    /**
     * Diese Methode sucht einen Datensazt anhand seiner ID in der Datenbank
     * und liefert den ersten, gefundenen Treffer zurück.
     *
     * @param  {Number} id Datensatz-ID
     * @return {Object} Gefundener Datensatz
     */
    /**getRecordById(id) {
        id = parseInt(id);
        return this._data.find(r => r.id === id);
    }
    */

    /**
     * Diese Methode gibt eine Liste mit allen Datensätzen zurück.
     * @return {Array} Liste aller Datensätze
     */
     /**
    getAllRecords() {
        return this._data;
    }*/
}
