const canvas = document.getElementById('score');
const ctx = canvas.getContext('2d');
const staffLineSpacing = 20;
const symbolSpacing = 20;
const barCount = 7;
const imgRatio = {"whole_note": 320/176, "treble_clef": 87/238, "time_signature_4_4": 134/329, "whole_rest": 232/479};

/* pour créer une ligne avec des coordonnées */
class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}

/* pour créer une image avec position et dimensions */
class CanvasImage {
    constructor(path, xpos, ypos, width, height) {
        this.path = path;
        this.xpos = xpos;
        this.ypos = ypos;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        let xpos = this.xpos;
        let ypos = this.ypos;
        let width = this.width;
        let height = this.height;
        let image = new Image();
        image.src = this.path;
        image.onload = function () {
            ctx.drawImage(image, xpos, ypos, width, height);
        }
    }
}

/* symbole de clef avec ses coordonnées et dimensions qui sera placé sur une portée */
class Clef {
    constructor(name, staff, horPlaceInStaff) {
        this.name = name;
        this.staff = staff;
        this.setHorPlaceInStaff(horPlaceInStaff);
        this.ypos = this.staff.ypos - 27;
        this.height = 140;
        this.width = this.height * imgRatio[name];
        this.imagePath = "img/" + name + ".png";
    }

    setHorPlaceInStaff(x) {
        this.horPlaceInStaff = x;
        this.xpos = this.staff.xpos + x;
    }

    draw(ctx) {
        let image = new CanvasImage(this.imagePath, this.xpos, this.ypos, this.width, this.height);
        image.draw(ctx);
    }
}

/* indication de mesure */
class TimeSignature {
    constructor(name, staff, horPlaceInStaff) {
        this.name = name;
        this.staff = staff;
        this.setHorPlaceInStaff(horPlaceInStaff);
        this.ypos = this.staff.ypos;
        this.height = staffLineSpacing * 4;
        this.width = this.height * imgRatio[name];
        this.imagePath = "img/" + name + ".png";
    }

    setHorPlaceInStaff(x) {
        this.horPlaceInStaff = x;
        this.xpos = this.staff.xpos + x;
    }

    draw(ctx) {
        let image = new CanvasImage(this.imagePath, this.xpos, this.ypos, this.width, this.height);
        image.draw(ctx);
    }
}

/* barre de mesure */
class BarLine {
    constructor(staff, horPlaceInStaff) {
        this.staff = staff;
        this.setHorPlaceInStaff(horPlaceInStaff);
        this.ypos = this.staff.ypos;
        this.height = staffLineSpacing * 4;
        this.width = 0;
    }

    setHorPlaceInStaff(x) {
        this.horPlaceInStaff = x;
        this.xpos = this.staff.xpos + x;
    }

    draw(ctx) {
        let line = new Line(this.xpos, this.ypos, this.xpos, this.ypos + this.height);
        line.draw(ctx);
    }
}

/* figure de note, correspondant à la durée de la note (noire, blanche, ronde...) */
class NoteFigure {
    constructor(name) {
        this.name = name;
        this.height = staffLineSpacing;
        this.width = this.height * imgRatio[name];
        this.imagePath = "img/" + name + ".png";
    }
}

let wholeNote = new NoteFigure("whole_note");

/* hauteur de note (la4, ré#3...) avec la fréquence et la hauteur sur la portée correspondantes */
class NoteValue {
    constructor(name, octave, alteration, frequency, vertPlaceInStaff) {
        this.name = name;
        this.octave = octave;
        this.alteration = alteration;
        this.frequency = frequency;
        this.vertPlaceInStaff = vertPlaceInStaff;
    }
}

/* création d'une liste de hauteurs de notes que l'on pourra utiliser */
const allNoteValues = [];
let re4 = new NoteValue("D", 4, "natural", 293.66, 8);
allNoteValues.push(re4);
let mi4 = new NoteValue("E", 4, "natural", 329.63, 7);
allNoteValues.push(mi4);
let fa4 = new NoteValue("F", 4, "natural", 349.23, 6);
allNoteValues.push(fa4);
let sol4 = new NoteValue("G", 4, "natural", 392, 5);
allNoteValues.push(sol4);
let la4 = new NoteValue("A", 4, "natural", 440, 4);
allNoteValues.push(la4);
let si4 = new NoteValue("B", 4, "natural", 493.88, 3);
allNoteValues.push(si4);
let do5 = new NoteValue("C", 5, "natural", 523.25, 2);
allNoteValues.push(do5);
let re5 = new NoteValue("D", 5, "natural", 587.33, 1);
allNoteValues.push(re5);
let mi5 = new NoteValue("E", 5, "natural", 659.25, 0);
allNoteValues.push(mi5);
let fa5 = new NoteValue("F", 5, "natural", 698.46, -1);
allNoteValues.push(fa5);
let sol5 = new NoteValue("G", 5, "natural", 783.99, -2);
allNoteValues.push(sol5);

/* une note qui pourra être placée sur la portée, on lui attribue une figure de note (durée) et une hauteur */
class Note {
    constructor(noteFigure, noteValue, staff, horPlaceInStaff) {
        this.noteFigure = noteFigure;
        this.noteValue = noteValue;
        this.staff = staff;
        this.setHorPlaceInStaff(horPlaceInStaff);
        this.vertPlaceInStaff = noteValue.vertPlaceInStaff;
        this.ypos = staff.ypos + this.vertPlaceInStaff * staffLineSpacing / 2;
        this.height = noteFigure.height;
        this.width = noteFigure.width;
    }

    setHorPlaceInStaff(x) {
        this.horPlaceInStaff = x;
        this.xpos = this.staff.xpos + x;
    }

    draw(ctx) {
        let image = new CanvasImage(this.noteFigure.imagePath, this.xpos, this.ypos, this.noteFigure.width, this.noteFigure.height);
        image.draw(ctx);
    }
}

/* figure de silence, correspondant à une durée et un symbole spécifiques */
class RestFigure {
    constructor(name) {
        this.name = name;
        this.height = staffLineSpacing * 4;
        this.width = this.height * imgRatio[name];
        this.imagePath = "img/" + name + ".png";
    }
}

/* un silence qui pourra être placé sur la portée auquel on attribue une figure (durée) */
class Rest {
    constructor(restFigure, staff, horPlaceInStaff) {
        this.restFigure = restFigure;
        this.staff = staff;
        this.setHorPlaceInStaff(horPlaceInStaff);
        this.ypos = staff.ypos;
        this.height = restFigure.height;
        this.width = restFigure.width;
    }

    setHorPlaceInStaff(x) {
        this.horPlaceInStaff = x;
        this.xpos = this.staff.xpos + x;
    }

    draw(ctx) {
        let image = new CanvasImage(this.restFigure.imagePath, this.xpos, this.ypos, this.restFigure.width, this.restFigure.height);
        image.draw(ctx);
    }
}


let wholeRest = new RestFigure("whole_rest");

/* une portée qui pourra être affichée dans le canvas */
class Staff {
    constructor(xpos, ypos, length, lineSpacing = staffLineSpacing, symbolList = []) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.length = length;
        this.lineSpacing = lineSpacing;
        this.lines = [];
        /* liste des symboles placés sur la clef */
        this.symbols = [];
        /* position du prochain symbole à placer */
        this.horPlaceForNextSymbol = 0;

        this.draw(ctx);
        if (symbolList.length == 0) {
            this.initEmpty();
        }
        else {
            this.fromJson(symbolList);
        }
    }

    draw(ctx) {
        /* affichage des 5 lignes */
        for (let i = 0; i < 5; i++) {
            let line = new Line(this.xpos, this.ypos + i * this.lineSpacing, this.xpos + this.length, this.ypos + i * this.lineSpacing);
            line.draw(ctx);
            this.lines.push(line);
        }

        /* affichage des symboles de la liste */
        for (let i = 0; i < this.symbols.length; i++) {
            this.drawSymbol(this.symbols[i], ctx);
        }
    }

    addClef(name) {
        let clef = new Clef(name, this, this.horPlaceForNextSymbol);
        this.addSymbol(clef);
    }

    addTimeSignature(name) {
        let timeSignature = new TimeSignature(name, this, this.horPlaceForNextSymbol);
        this.addSymbol(timeSignature);
    }

    addBarLine() {
        let barLine = new BarLine(this, this.horPlaceForNextSymbol);
        this.addSymbol(barLine);
    }

    addNote(noteFigure, noteValue, idxInStaff = -1) {
        if (idxInStaff == -1) {
            let note = new Note(noteFigure, noteValue, this, this.horPlaceForNextSymbol);
            this.addSymbol(note);
        }
        else {
            let note = new Note(noteFigure, noteValue, this, this.symbols[idxInStaff].horPlaceInStaff);
            this.replaceSymbol(note, idxInStaff);
        }
    }

    addRest(restFigure) {
        let rest = new Rest(restFigure, this, this.horPlaceForNextSymbol);
        this.addSymbol(rest);
    }

    /* ajout du symbole à la liste et mise à jour de l'emplacement où placer le prochain */
    addSymbol(symbol) {
        this.symbols.push(symbol);
        this.horPlaceForNextSymbol += symbol.width + symbolSpacing;
        this.drawSymbol(symbol, ctx);
    }

    /* supprime la note se trouvant à l'indice donné en la remplaçant par un silence */
    deleteNote(idxInStaff) {
        let rest = new Rest(wholeRest, this, this.symbols[idxInStaff].horPlaceInStaff);
        this.replaceSymbol(rest, idxInStaff);
    }

    /* affichage d'un symbole */
    drawSymbol(symbol, ctx) {
        symbol.draw(ctx);
    }

    /* suppression d'un symbole */
    deleteSymbol(idxInStaff) {
        /* suppression du symbole de la liste */
        this.symbols.splice(idxInStaff, 1);
        this.updatePositionOfLastSymbols(idxInStaff)
    }

    /* remplace un symbole de la portée par un symbole donné */
    replaceSymbol(symbol, idxInStaff) {
        this.symbols[idxInStaff] = symbol;
        this.updatePositionOfLastSymbols(idxInStaff);
    }

    /* mise à jour des positions des symboles à partir de l'indice fromIdx */
    updatePositionOfLastSymbols(fromIdx) {
        for (let j = fromIdx; j < this.symbols.length; j++) {
            let previousSymbol = this.symbols[j-1];
            let symbol = this.symbols[j];
            if (j == 0) {
                symbol.setHorPlaceInStaff(0);
            }
            else {
                symbol.setHorPlaceInStaff(previousSymbol.horPlaceInStaff + previousSymbol.width + symbolSpacing);
            }
        }
        /* on efface le canvas et on réaffiche la portée */
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.draw(ctx);
        /* mise à jour de l'emplacement du prochain symbole */
        let lastSymbol = this.symbols[this.symbols.length - 1];
        this.horPlaceForNextSymbol = lastSymbol.horPlaceInStaff + lastSymbol.width + symbolSpacing;
    }

    initEmpty() {
        /* symboles qui apparaissent sur la portée au départ */
        this.addClef("treble_clef");
        this.addTimeSignature("time_signature_4_4");
        for (let i = 0; i < barCount; i++) {
            this.addRest(wholeRest);
            this.addBarLine();
        }
    }

    fromJson(symbolList) {
        for (let i = 0; i < symbolList.length; i++) {
            let nextSymbol = symbolList[i];
            if (nextSymbol["type"] == "clef") {
                this.addClef(nextSymbol["name"]);
                console.log(this.symbols);
            }
            if (nextSymbol["type"] == "timeSignature") {
                this.addTimeSignature(nextSymbol["name"]);
            }
            if (nextSymbol["type"] == "barLine") {
                this.addBarLine();
            }
            if (nextSymbol["type"] == "note") {
                let noteValue = allNoteValues[0];
                for (let j = 0; j < allNoteValues.length; j++) {
                    if (allNoteValues[j].name == nextSymbol["noteValueName"] && allNoteValues[j].octave == nextSymbol["octave"] && allNoteValues[j].alteration == nextSymbol["alteration"]) {
                        noteValue = allNoteValues[j];
                    }
                }
                this.addNote(wholeNote, noteValue);
            }
            if (nextSymbol["type"] == "rest") {
                this.addRest(wholeRest);
            }
        }
    }

    toJson() {
        let symbolList = [];
        for (let i = 0; i < this.symbols.length; i++) {
            let symbol = this.symbols[i];
            console.log(symbol);
            if (symbol instanceof Clef) {
                symbolList.push({"type": "clef", "name": symbol.name})
            }
            if (symbol instanceof TimeSignature) {
                symbolList.push({"type": "timeSignature", "name": symbol.name})
            }
            if (symbol instanceof BarLine) {
                symbolList.push({"type": "barLine"})
            }
            if (symbol instanceof Note) {
                symbolList.push({"type": "note", "noteFigure": symbol.noteFigure.name, "noteValueName": symbol.noteValue.name, "octave": symbol.noteValue.octave, "alteration": symbol.noteValue.alteration})
            }
            if (symbol instanceof Rest) {
                symbolList.push({"type": "rest", "restFigure": symbol.restFigure.name})
            }
        }
        return symbolList
    }
}

const myStaff = new Staff(50, 110, 700);
/*const myStaff = new Staff(50, 110, 700, 20, [{"type": "clef", "name": "treble_clef"}, {"type": "barLine"}, {"type": "note", "noteFigure": "wholeNote", "noteValueName": "G", "octave": 4, "alteration": "natural"}]);
let symbolList = myStaff.toJson();
const otherStaff = new Staff(50, 300, 700, 20, symbolList);*/

/* mode (ajout / suppression de notes) */
class Mode {
    constructor() {
        this.value = "add_note";
        this.noteFigure = wholeNote;
    }

    toDeleteNote() {
        this.value = "delete_note";
    }

    toAddNote() {
        this.value = "add_note";
    }
}

const mode = new Mode();

/* ajoute une note ou non en fonction de la position du clic */
function addNoteOnClick(x, y) {
    /* on parcourt les symboles de la portée pour trouver lequel est potentiellement à remplacer */
    for (let idxInStaff = 0; idxInStaff < myStaff.symbols.length; idxInStaff++) {
        let symbol = myStaff.symbols[idxInStaff];
        let xLeft = symbol.xpos;
        let xRight = symbol.xpos + symbol.width;
        let isNoteOrRest = symbol instanceof Note || symbol instanceof Rest;
        if (x > xLeft && x < xRight && isNoteOrRest) {
            /* on parcourt toutes les hauteurs de notes pour savoir quelle note doit être créée après le clic */
            for (let i = 0; i < allNoteValues.length; i++) {
                let yposInStaff = y - myStaff.ypos - staffLineSpacing/2;
                if (( yposInStaff > (allNoteValues[i].vertPlaceInStaff - 1/2) * staffLineSpacing/2) && (yposInStaff < (allNoteValues[i].vertPlaceInStaff + 1/2) * staffLineSpacing/2)) {
                    myStaff.addNote(wholeNote, allNoteValues[i], idxInStaff);
                }
            }
        }
    }
}

/* supprime une note ou non en fonction de la position du clic */
function deleteNoteOnClick(x, y) {
    for (let i = 0; i < myStaff.symbols.length; i++) {
        let symbol = myStaff.symbols[i];
        if (symbol instanceof Note) {
            if ((x > symbol.xpos) && (x < symbol.xpos + symbol.width) && (y > symbol.ypos) && (y < symbol.ypos + symbol.height)) {
                myStaff.deleteNote(i);
            }
        }
    }
}

/* effectue une action lors d'un clic */
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (mode.value == "add_note") {
        addNoteOnClick(x, y);
    }
    if (mode.value == "delete_note") {
        deleteNoteOnClick(x, y);
    }
})

/* effectue une action lorsque l'on appuie sur une touche du clavier */
window.addEventListener("keydown", (event) => {
    if (event.key == "a") {
        mode.toAddNote();
    }
    if (event.key == "d") {
        mode.toDeleteNote();
    }
})

/* avoir une note qui suit le déplacement de la souris de cette manière */
/* fait laguer parce qu'il faut tout redessiner en permanence */
/*
let noteGrise = new Note(wholeNote, re4, staff, staff.horPlaceForNextSymbol);

(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {

        let xpos = event.clientX;
        let ypos = event.clientY;
        if (xpos > staff.horPlaceForNextSymbol - 50 && xpos < staff.horPlaceForNextSymbol + 50) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            staff.draw(ctx);
            noteGrise.xpos = xpos;
            noteGrise.ypos = ypos;
            noteGrise.draw(ctx);
        }
        

    }
})();
*/