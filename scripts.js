var output = "";
var paren = 0;
var inside = "";
var displayAnswer = false;
var index = 0;

$(function() {
    $(".gray, .white").click(function(event) {
        if (displayAnswer) {
            output = "";
            displayAnswer = false;
        }
        if ($(event.target).text() === "( )") {
            if (paren++ % 2 === 0)
                output += "(";
            else
                output += ")";
        } else if (event.target.className.includes("gray")) {
            if (/[0-9\(\)]/.test(output.slice(-1)))
                output += $(event.target).text();
        } else
            output += $(event.target).text();
        updateScreen();
    });
    $(".blue").click(function() {
        paren = 0;
        output = "";
        updateScreen();
    });
    $(".green").click(function() {
        if ((output[output.length - 1] === ")") || (output[output.length - 1] === "("))
            paren--;
        output = output.slice(0, -1);
        updateScreen();
    });
    $(".big-bn").click(function() {
        if (displayAnswer) {
            output = "";
            displayAnswer = false;
        } else
            output = calculate(output);
        updateScreen();
    });

});

function updateScreen() {
    $("p").html(output);
}

function calculate(x) {
    var operators = [];
    var numbers = [];

    if (x === "") {
        return "";
    }

    for (var i = 1; i < x.length; i++) {
        if (x[i] === "(") {
            if (!/[\+\-x÷]/.test(x[i - 1])) {
                x = x.slice(0, i) + "x" + x.slice(i);
            }
        }
    }


    if (/[^0-9\(\)]/.test(x[x.length - 1])) {
        x = x.slice(0, -1);
    }

    if (/\(/.test(x)) {
        if (paren % 2 === 1) {
            x += ")";
            paren++;
        }

        inside = x.slice(x.search(/\(/) + 1, x.search(/\)/));
        x = x.replace("(" + inside + ")", calculate(inside));
        return calculate(x);
    } else {
        numbers = x.split(/[^.0-9]/g);
        if (numbers.length === 1) {
            displayAnswer = true;
            return x;
        } else
            operators = x.match(/[^.0-9]/g);

        while ((operators.indexOf("x") !== -1) || (operators.indexOf("÷") !== -1)) {
            if (((operators.indexOf("x") < operators.indexOf("÷")) || (operators.indexOf("÷") === -1)) && (operators.indexOf("x") !== -1)) {
                index = operators.indexOf("x");
                numbers[index] = +numbers[index] * +numbers[index + 1];
            } else {
                index = operators.indexOf("÷");
                numbers[index] = +numbers[index] / +numbers[index + 1];
            }
            numbers.splice(index + 1, 1);
            operators.splice(index, 1);
        }
        while ((operators.length) && (numbers.length != 1)) {
            if (operators[0] === "+") {
                numbers[0] = +numbers[0] + +numbers[1];
            } else {
                numbers[0] = +numbers[0] - +numbers[1];
            }
            numbers.splice(1, 1);
            operators.shift();
        }
        displayAnswer = true;
        output = numbers[0];
        return numbers[0];
    }
}
