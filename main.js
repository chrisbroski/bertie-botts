/* jshint esversion: 6 */

var data,
    lineCount = 0,
    beanCount = 20,
    student = {},
    sizes = {"10": "tiny", "20": "small", "50": "", "100": "large"},
    low = 28,
    high = 43,
    determine; // For deterministic "random"

function rand(max) {
    return Math.floor(Math.random() * max);
}

Array.prototype.rand = function () {
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.determine = function () {
    var rslt = Math.abs(determine());
    return this[Math.floor(rslt * this.length)];
};

String.prototype.capitalize = function (cap) {
    if (!this) {
        return "";
    }
    return (cap) ? this.slice(0, 1).toUpperCase() + this.slice(1) : this;
};

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery#answer-7616484
// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
function hashCode(str) {
    return str.split("").reduce(function (a, b) {
        return ((a << 5) - a) + b.charCodeAt(0);
    }, 0);
}

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript#answer-47593316
// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
function lrng(seed) {
    function lcg(a) {
        return a * 48271 % 2147483647;
    }
    return function(peek) {
        if (peek) {
            return lcg(seed) / 2147483648;
        }
        seed = lcg(seed);
        window.localStorage.setItem("seed", seed.toString(10));
        return seed / 2147483648;
    };
}

function total(flavor) {
    var tastes = flavor[Object.keys(flavor)[0]];
    return Object.keys(tastes).reduce(function (a, b) {
        return a + tastes[b];
    }, 0);
}

function showHideButtons(buttonToShow) {
    var buttons = document.querySelectorAll("fieldset p"), ii, display;
    for (ii = 0; ii < buttons.length; ii += 1) {
        display = (buttons[ii].id === buttonToShow) ? "inline-block" : "none";
        buttons[ii].style.display = display;
    }
}

function desc(flavor) {
    var tastes = flavor[Object.keys(flavor)[0]];
    var tot = total(flavor);

    if (tastes.putrid > 1) {
        return ". It was the worst thing " + pronoun() + "'d even tasted";
    }
    if (tastes.hot > 1) {
        return ". It burned " + possessive() + " mouth";
    }
    if (tastes.sweet > 1) {
        return [". It was very sweet", ". It was quite sweet"].rand();
    }
    if (tastes.sour > 1) {
        return ". " + possessive(true) + " face puckered at how sour it was";
    }
    if (tastes.bitter > 1) {
        return ". It was unpleasantly bitter";
    }
    if (tastes.salty > 1) {
        return ". It was terribly too salty";
    }
    if (tastes.savory > 1) {
        return [". It was quite good", ". Mmm, that was satisfyingly savory"].rand();
    }

    if (total > 4) {
        return ". It was extremely flavorful";
    }
    if (tastes.sweet > 0 && tastes.sour > 0) {
        return [". It was pleasingly tangy", ". Tangy"].rand();
    }
    if (tastes.putrid > 0) {
        return [". A little weird, but OK", ". It was a bit funky-tasting"].rand();
    }
    if (tastes.hot > 0) {
        return ". It was mildly spicy";
    }
    if (tastes.sour > 0) {
        return ". It was a bit tart";
    }
    if (tastes.bitter > 0) {
        return ". It was slightly bitter";
    }
    if (tastes.savory > 0) {
        return ". It was not too bad";
    }
    if (tastes.sweet > 0) {
        return ". It was mildly sweet";
    }
    if (tastes.salty > 0) {
        return ". Salty";
    }

    if (total === 0) {
        return ". It was surprisingly bland";
    }

    return [". It was OK", ". Meh"].rand();
}

function typewrite(text) {
    var p = document.querySelector("main p:last-child"), ii;
    var buttons = document.querySelectorAll("fieldset button");

    if (!text) {
        for (ii = 0; ii < buttons.length; ii += 1) {
            buttons[ii].disabled = false;
        }
    } else {
        p.appendChild(document.createTextNode(text.slice(0, 1)));
        window.setTimeout(
            function () {
                typewrite(text.slice(1));
                document.querySelector("fieldset").scrollIntoView(false);
            }, 20
        );
    }
}

function startwriting(text) {
    var buttons = document.querySelectorAll("fieldset button"), ii;
    for (ii = 0; ii < buttons.length; ii += 1) {
        buttons[ii].disabled = true;
    }
    typewrite(text);
}

function chooseBean() {
    write(data.flavors.determine());
}

function isDisgusting(flavor) {
    var putrid = flavor.putrid,
        hot = flavor.hot,
        determination = student.attr.WD;
    return (putrid > 1 || (determination < low && (putrid > 0 || hot > 1)));
}

function write(flavor) {
    var beanName = Object.keys(flavor)[0],
        putrid = flavor[beanName].putrid,
        hot = flavor[beanName].hot,
        main = document.querySelector("main"),
        text = ". It tasted like ",
        description = desc(flavor);

    if (lineCount >= beanCount - 1) {
        main.appendChild(document.createElement("p"));
        startwriting(`The last bean in the box was ${beanName}-flavored${description}. ${student.given} looked forward to eating more`);
        showHideButtons("play");
        return;
    }
    if (lineCount === 0) {
        text = ". The first bean tasted like ";
    }
    if (lineCount === 1) {
        text = `. ${student.given} dared to try another. This one tasted like `;
    }
    if (lineCount === 2) {
        main.appendChild(document.createElement("p"));
        text = `Undeterred, ${pronoun()} dug into the box again. The next one tasted like `;
    }
    if (lineCount === 3) {
        text = `. ${student.given} tasted beans the flavor of `;
        description = "";
    }
    if (lineCount > 3) {
        text = ", ";
        if (lineCount == beanCount - 2) {
            text = ", and ";
        }
        description = "";
    }

    if (isDisgusting(flavor)) {
        if (document.querySelector("main p:last-child").textContent !== "") {
            main.appendChild(document.createElement("p"));
        }
        if (student.attr.WD > high) {
            startwriting(`Ugh! That one was ${beanName}-flavored. It will be a few days before ${student.given} is ready to eat Bertie Bott's again`);
        } else if (student.attr.WD < low) {
            startwriting(`Ugh! That one was ${beanName}-flavored. ${student.given} swears ${pronoun()} won't eat one ever again`);
        } else {
            startwriting(`Ugh! That one was ${beanName}-flavored. ${student.given} spit it out and is done eating Bertie Bott's for a long while`);
        }
        showHideButtons("play");
    } else {
        startwriting(text + beanName + description);
    }

    lineCount += 1;
}

function isMale() {
    if (student.gender === "male") {
        return 1;
    }
    return 0;
}

function pronoun(cap) {
    return ["she", "he"][isMale()].capitalize(cap);
}

function pronoun2(cap) {
    return ["her", "him"][isMale()].capitalize(cap);
}

function possessive(cap) {
    return ["her", "his"][isMale()].capitalize(cap);
}

function openBag() {
    var adverb = (student.attr.WD < low) ? `nervously ` : "";
    showHideButtons("eat");
    startwriting(`. ${pronoun(true)} opened the box and ${adverb}searched for the most delicious-looking color`);
}

function end() {
    document.querySelector("main").appendChild(document.createElement("p"));
    startwriting(`${student.given} closed the box. Maybe ${pronoun()}'ll try more later`);
    showHideButtons("play");
}

function attVal() {
    return Math.ceil(Math.random() * 15) + Math.ceil(Math.random() * 15) + Math.ceil(Math.random() * 14) + Math.ceil(Math.random() * 15) + 4;
}

function save() {
    window.localStorage.setItem("gender", student.gender);
    window.localStorage.setItem("sur", student.sur);
    window.localStorage.setItem("given", student.given);
    window.localStorage.setItem("attr", JSON.stringify(student.attr));
}

function play() {
    var p = document.createElement("p"),
        main = document.querySelector("main"),
        extra = "",
        fate;

    student.gender = ["male", "female"].rand();
    beanCount = [10, 20, 20, 50, 100].rand();
    student.sur = data.names.sur.rand();
    student.given = data.names[student.gender].rand();
    student.attr = {};
    student.attr.WD = attVal();

    save();

    fate = hashCode(student.sur + student.given);
    window.localStorage.setItem("fate", fate);
    determine = lrng(fate);

    main.innerHTML = "";
    lineCount = 0;
    showHideButtons("open");

    if (student.attr.WD < low) {
        extra = `. ${pronoun(true)} was not a big fan, but felt obligated to try at least one`;
    }

    if (student.attr.WD > high) {
        extra = `. Awesome! They are one of ${possessive()} favorite sweets`;
    }

    p.textContent = `${student.given} ${student.sur} looked up from ${possessive()} breakfast as delivery owls streamed through the windows of Hogwart's Great Hall. A large tawny landed next to ${pronoun2()} and extended its leg. ${student.given} gently removed the package, then tore into the brown paper. Inside was a ${sizes[parseInt(beanCount, 10)]} box of ${beanCount} Bertie Bott's Every Flavor Beans${extra}`;
    main.appendChild(p);
}

function setHouse() {
    var className = location.hash,
        html = document.querySelector("html");

    html.className = (className) ? className.slice(1) : "";
}
window.onhashchange = setHouse;
window.onload = function () {
    var xhr = new XMLHttpRequest();

    if (location.hash) {
        document.querySelector("select").value = location.hash.slice(1);
    }
    setHouse();

    xhr.open("GET", "flavors.json");
    xhr.onload = function () {
        data = JSON.parse(xhr.response);

        var xhr2 = new XMLHttpRequest();
        xhr2.open("GET", "names.json");
        xhr2.onload = function () {
            data.names = JSON.parse(xhr2.response);
            play();
            document.getElementById("open").style.display = "inline-block";
        };
        xhr2.send();
    };
    xhr.send();
};
document.querySelector("select").onchange = function () {
    location.href = "#" + this.value;
};
