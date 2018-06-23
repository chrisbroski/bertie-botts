var data,
    xhr = new XMLHttpRequest(),
    lineCount = 0,
    beanCount = 20,
    student = {},
    sizes = {"10": "tiny", "20": "small", "50": "", "100": "large"},
    gem;

xhr.open("GET", "flavors.json");
xhr.onload = function (e) {
    data = JSON.parse(xhr.response);

    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "names.json");
    xhr2.onload = function (e2) {
        data.names = JSON.parse(xhr2.response);
        play();
        document.getElementById("open").style.display = "inline-block";
    }
    xhr2.send();
};
xhr.send();

Array.prototype.rand = function () {
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.gem = function () {
    return this[Math.floor(gem() * this.length)];
};

String.prototype.format = function () {
    var pattern = /\{\d+\}/g, args = arguments;
    return this.replace(pattern, function (capture) {
        return args[capture.match(/\d+/)];
    });
};

String.prototype.capitalize = function () {
    if (!this) {
        return "";
    }
    return this.slice(0, 1).toUpperCase() + this.slice(1);
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
    return function() {
        return (seed = lcg(seed)) / 2147483648;
    };
}

function total(flavor) {
    var tastes = flavor[Object.keys(flavor)[0]]
    return Object.keys(tastes).reduce(function (a, b) {
        return a + tastes[b];
    }, 0);
}

function showHideButtons(buttonToShow) {
    var buttons = document.querySelectorAll("fieldset p"), ii, display;
    for (ii = 0; ii < buttons.length; ii += 1) {
        display = (buttons[ii].id === buttonToShow) ? "inline-block" : "none";
        buttons[ii].style.display = display
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
        return [". That was quite good", ". Mmm, that was satisfyingly savory"].rand();
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
    var flavor = data.flavors.rand();
    write(flavor);
}

function write(flavor) {
    var beanName = Object.keys(flavor)[0],
        putrid = flavor[beanName].putrid,
        main = document.querySelector("main"),
        text = ". It tasted like ",
        description = desc(flavor);

    if (lineCount >= beanCount - 1) {
        main.appendChild(document.createElement("p"));
        startwriting("The last bean in the box was {0}-flavored{1}. {2} looked forward to eating more".format(
            beanName, description, student.given
        ));
        showHideButtons("play");
        return;
    }
    if (lineCount === 0) {
        text = ". The first bean tasted like "
    }
    if (lineCount === 1) {
        text = ". {0} dared to try another. This one tasted like ".format(student.given);
    }
    if (lineCount === 2) {
        main.appendChild(document.createElement("p"));
        text = "Undeterred, {0} dug into the box again. The next one tasted like ".format(pronoun());
    }
    if (lineCount === 3) {
        text = ". {0} tasted beans the flavor of ".format(student.given);
        description = "";
    }
    if (lineCount > 3) {
        text = ", ";
        if (lineCount == beanCount - 2) {
            text = ", and ";
        }
        description = "";
    }
    if (putrid > 1) {
        main.appendChild(document.createElement("p"));

        startwriting("Ugh! That one was {0}-flavored. {1} spit it out and is done eating Bertie Bott's for a long while".format(
            beanName,
            student.given
        ));
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

function pronoun(capitalize) {
    var pronouns = ["she", "he"];

    if (capitalize) {
        return pronouns[isMale()].capitalize();
    }
    return pronouns[isMale()];
}

function possessive(capitalize) {
    var pronouns = ["her", "his"];

    if (capitalize) {
        return pronouns[isMale()].capitalize();
    }
    return pronouns[isMale()];
}

function openBag() {
    showHideButtons("eat");
    startwriting(". {0} opened the box and searched for the most delicious-looking color".format(pronoun(true)));
}

function end() {
    document.querySelector("main").appendChild(document.createElement("p"));
    startwriting("{0} closed the box. Maybe {1}'ll try more later".format(
        student.given,
        pronoun()
    ));
    showHideButtons("play");
}

function play() {
    var p = document.createElement("p"),
        main = document.querySelector("main");

    student.gender = ["male", "female"].rand();
    beanCount = [10, 20, 20, 50, 100].rand();
    student.sur = data.names.sur.rand();
    student.given = data.names[student.gender].rand();

    gem = lrng(hashCode(student.sur + student.given));

    main.innerHTML = "";
    lineCount = 0;
    showHideButtons("open");
    p.textContent = "{0} {1} waited for {2} first delivery at Hogwarts. {3} gently removed the package from the owl's leg, then tore into the brown paper. Inside was a {4} box of {5} Bertie Bott's Every Flavor Beans".format(
        student.given,
        student.sur,
        possessive(),
        pronoun(true),
        sizes[parseInt(beanCount, 10)],
        beanCount
    );
    main.appendChild(p);
}

function setHouse() {
    var className = location.hash,
        html = document.querySelector("html");

    if (className) {
        html.className = className.slice(1);
    } else {
        html.className = "";
    }
}
window.onhashchange = setHouse;
window.onload = function () {
    if (location.hash) {
        document.querySelector("select").value = location.hash.slice(1);
    }
    setHouse();
}
document.querySelector("select").onchange = function () {
    location.href = "#" + this.value;
};
