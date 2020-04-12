/* jshint esversion: 6 */

var data,
    eaten = [],
    describedAs = [],
    beanCount = 20,
    student = {},
    sizes = {"10": "tiny", "20": "small", "50": "", "100": "large"},
    low = 29,
    high = 42,
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

function randDesc(descriptions) {
    var desc, descs = descriptions.filter(function (d) {
        return describedAs.indexOf(d) < 0;
    });
    if (descs.length === 0) {
        descs = descriptions;
    }

    desc = descs.rand();
    describedAs.push(desc);
    return desc;
}

function desc(flavor) {
    var tastes = flavor[Object.keys(flavor)[0]];
    var tot = total(flavor);

    if (tastes.putrid > 1) {
        return randDesc([
            ". It was the worst thing " + pronoun() + "'d even tasted",
            ". Ugh, gross"
        ]);
    }
    if (tastes.hot > 1) {
        return randDesc([
            ". It burned " + possessive() + " mouth",
            ". Ouch! That was hot",
            ". Ow! Too spicy"
        ]);
    }
    if (tastes.sweet > 1) {
        return randDesc([
            ". It was very sweet",
            ". It was quite sweet",
            ". " + possessive(true) + " teeth hurt from how sweet it was",
            ". It was cloyingly sweet"
        ]);
    }
    if (tastes.sour > 1) {
        return randDesc([
            ". " + possessive(true) + " face puckered at how sour it was",
            ". Whoa! That was sour"
        ]);
    }
    if (tastes.bitter > 1) {
        return ". It was unpleasantly bitter";
    }
    if (tastes.salty > 1) {
        return ". It was terribly salty";
    }
    if (tastes.savory > 1) {
        return randDesc([
            ". It was quite good",
            ". Mmm, that was satisfyingly savory"
        ]);
    }

    if (total > 4) {
        return ". It was extremely flavorful";
    }
    if (tastes.sweet > 0 && tastes.sour > 0) {
        return randDesc([
            ". It was pleasingly tangy",
            ". Tangy",
            ". Ooo, tangy"
        ]);
    }
    if (tastes.putrid > 0) {
        return randDesc([
            ". A little weird, but OK",
            ". It was a bit funky-tasting",
            ". It was... interesting"
        ]);
    }
    if (tastes.hot > 0) {
        return randDesc([
            ". It was mildly spicy",
            ". A bit spicy"
        ]);
    }
    if (tastes.sour > 0) {
        return randDesc([
            ". It was a bit tart",
            ". It was as little sour, but not too bad"
        ]);
    }
    if (tastes.bitter > 0) {
        return ". It was slightly bitter";
    }
    if (tastes.savory > 0) {
        return randDesc([
            ". It was not bad at all",
            ". Mm, that was not unpleasant"
        ]);
    }
    if (tastes.sweet > 0) {
        return randDesc([
            ". It was mildly sweet",
            ". It tasted pleasantly sweet"
        ]);
    }
    if (tastes.salty > 0) {
        return ". Salty";
    }

    if (total === 0) {
        return randDesc([
            ". It was surprisingly bland",
            ". It tasted like... nothing"
        ]);
    }

    return randDesc([
        ". It was OK",
        ". Meh",
        ". It was something",
        ". " + pronoun(true) + " had tasted worse things"
    ]);
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
            }, 10
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
    var beanName = Object.keys(flavor)[0],
        putrid = flavor[beanName].putrid,
        hot = flavor[beanName].hot,
        determination = student.attr.WD;

    return (putrid > 1 || (determination < low && (putrid > 0 || hot > 1)));
}

function write(flavor) {
    var beanName = Object.keys(flavor)[0],
        putrid = flavor[beanName].putrid,
        hot = flavor[beanName].hot,
        main = document.querySelector("main"),
        text = ". It tasted like ",
        description = desc(flavor),
        another = "";

    if (eaten.indexOf(beanName) >= 0) {
        another = " another ";
    }
    eaten.push(beanName);

    if (eaten.length >= beanCount) {
        main.appendChild(document.createElement("p"));
        if (isDisgusting(flavor)) {
            startwriting(`The last bean in the box was ${beanName}-flavored${description}`);
        } else {
            startwriting(`The last bean in the box was ${beanName}-flavored${description}. ${student.given} looked forward to eating more`);
        }
        showHideButtons("play");
        return;
    }
    if (eaten.length === 1) {
        text = ". The first bean tasted like ";
    }
    if (eaten.length === 2) {
        text = `. ${student.given} dared to try another. This one tasted like `;
    }
    if (eaten.length === 3) {
        main.appendChild(document.createElement("p"));
        text = `Undeterred, ${pronoun()} dug into the box again. The next one tasted like `;
    }
    if (eaten.length === 4) {
        text = `. ${student.given} tasted beans the flavor of `;
        description = "";
    }
    if (eaten.length > 4) {
        text = ", ";
        if (eaten.length == beanCount - 1) {
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
            startwriting(`Ugh! That one was ${beanName}-flavored. ${student.given} swears ${pronoun()} won't eat these ever again`);
        } else {
            startwriting(`Ugh! That one was ${beanName}-flavored. ${student.given} spit it out and is done eating Bertie Bott's for a long while`);
        }
        showHideButtons("play");
    } else {
        startwriting(text + another + beanName + description);
    }
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

function boxMuller() {
    var x = 0, y = 0, rds, c;

    do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        rds = x * x + y * y;
    }
    while (rds == 0 || rds > 1);

    c = Math.sqrt(-2 * Math.log(rds) / rds);
    return [x * c, y * c];
}

function attVal() {
    // return Math.ceil(Math.random() * 15) + Math.ceil(Math.random() * 15) + Math.ceil(Math.random() * 14) + Math.ceil(Math.random() * 15) + 4;
    return Math.round(boxMuller()[0] * 6.5 + 35.5);
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

    eaten.length = 0;
    describedAs.length = 0;
    student.gender = ["male", "female"].rand();
    beanCount = [10, 20, 20, 50, 100].rand();
    student.sur = data.names.magic.sur.rand();
    student.given = data.names.magic[student.gender].rand();
    student.attr = {};
    student.attr.WD = attVal();

    save();

    fate = hashCode(student.sur + student.given);
    window.localStorage.setItem("fate", fate);
    determine = lrng(fate);

    main.innerHTML = "";
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

// Testing tools
function showDebug() {
    if (location.search === "?debug") {
        document.querySelector("#debug").style.display = "block";
        document.querySelector("aside pre").textContent = JSON.stringify(student, null, "  ");
    }
}

function testFlavor(flavorIndex) {
    write(data.flavors[flavorIndex]);
}

// Page-level events
window.onhashchange = setHouse;
window.onload = function () {
    var xhr = new XMLHttpRequest();

    if (location.hash) {
        document.querySelector("select").value = location.hash.slice(1);
    }
    setHouse();

    xhr.open("GET", "flavors.json?v2");
    xhr.onload = function () {
        data = JSON.parse(xhr.response);

        var xhr2 = new XMLHttpRequest();
        xhr2.open("GET", "names.json?v2");
        xhr2.onload = function () {
            data.names = JSON.parse(xhr2.response).names;
            play();
            document.getElementById("open").style.display = "inline-block";
            showDebug();
        };
        xhr2.send();
    };
    xhr.send();
};
document.querySelector("select").onchange = function () {
    location.href = "#" + this.value;
};
