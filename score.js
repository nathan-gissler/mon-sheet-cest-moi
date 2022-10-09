const canvas = document.getElementById('score');
const ctx = canvas.getContext('2d');
const staffLineSpacing = 20;
const symbolSpacing = 20;
const imgRatio = {"whole_note": 320/176, "treble_clef": 87/238};

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 800, 500);

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

class Staff {
    constructor(xpos, ypos, length, lineSpacing = staffLineSpacing) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.length = length;
        this.lineSpacing = lineSpacing;
        this.lines = [];
        this.symbols = [];
        this.horPlaceForNextSymbol = 0;
    }

    draw(ctx) {
        for (let i = 0; i < 5; i++) {
            let line = new Line(this.xpos, this.ypos + i * this.lineSpacing, this.xpos + this.length, this.ypos + i * this.lineSpacing);
            line.draw(ctx);
            this.lines.push(line);
        }
        this.addClef("treble_clef");
    }

    addNote(noteFigure, noteValue) {
        let note = new Note(noteFigure, noteValue, this, this.horPlaceForNextSymbol);
        note.draw(ctx);
        this.symbols.push(note);
        this.horPlaceForNextSymbol += noteFigure.width + symbolSpacing;
    }

    addClef(name) {
        let clef = new Clef(name, this, this.horPlaceForNextSymbol);
        clef.draw(ctx);
        this.symbols.push(clef);
        this.horPlaceForNextSymbol += clef.width + symbolSpacing;
    }
}

class NoteFigure {
    constructor(name) {
        this.name = name;
        this.height = staffLineSpacing;
        this.width = this.height * imgRatio[name];
        this.imagePath = "img/" + name + ".png";
    }
}

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

class NoteValue {
    constructor(name, octave, alteration, frequency, vertPlaceInStaff) {
        this.name = name;
        this.octave = octave;
        this.alteration = alteration;
        this.frequency = frequency;
        this.vertPlaceInStaff = vertPlaceInStaff;
    }
}

class Note {
    constructor(noteFigure, noteValue, staff, horPlaceInStaff) {
        this.noteFigure = noteFigure;
        this.noteValue = noteValue;
        this.staff = staff;
        this.horPlaceInStaff = horPlaceInStaff;
        this.vertPlaceInStaff = noteValue.vertPlaceInStaff;
        this.xpos = staff.xpos + horPlaceInStaff;
        this.ypos = staff.ypos + this.vertPlaceInStaff * staffLineSpacing / 2;
    }

    draw(ctx) {
        let image = new CanvasImage(this.noteFigure.imagePath, this.xpos, this.ypos, this.noteFigure.width, this.noteFigure.height);
        image.draw(ctx);
    }
}

class Clef {
    constructor(name, staff, horPlaceInStaff) {
        this.name = name;
        this.staff = staff;
        this.horPlaceInStaff = horPlaceInStaff;
        this.xpos = staff.xpos + horPlaceInStaff;
        this.ypos = this.staff.ypos - 27;
        this.height = 140;
        this.width = this.height * imgRatio[name];
        this.imagePath = "img/" + name + ".png";
    }

    draw(ctx) {
        let image = new CanvasImage(this.imagePath, this.xpos, this.ypos, this.width, this.height);
        image.draw(ctx);
    }
}

const staff = new Staff(50, 110, 700);
staff.draw(ctx);

let wholeNote = new NoteFigure("whole_note");

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

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x > staff.xpos + staff.horPlaceForNextSymbol) {
        for (let i = 0; i < allNoteValues.length; i++) {
            let yposInStaff = y - staff.ypos - staffLineSpacing/2;
            if (( yposInStaff > (allNoteValues[i].vertPlaceInStaff - 1/2) * staffLineSpacing/2) && (yposInStaff < (allNoteValues[i].vertPlaceInStaff + 1/2) * staffLineSpacing/2)) {
                staff.addNote(wholeNote, allNoteValues[i]);
            }
        }
    }
})