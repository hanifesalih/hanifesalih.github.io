var numText = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn'];
//var numText = ['null', 'eins', 'zwei'];
var numbers = [];
var numCorrect = 0;
var secLeft = 45;

export.a = function Numbers(numbersCookie, numCorrectCookie) {
    console.log(numbersCookie);
    if (numCorrectCookie == null) {
        numCorrect = 0;
    } else {
        numCorrect = numCorrectCookie;
    }
    //numbers = [];
    if (numbersCookie == null) {
        for (var i = 0; i < numText.length; i++) {
            var number = new Number(numText[i], i, 0, false);
            //        console.log(number);
            numbers.push(number);
        }
    } else {
        numbers = numbersCookie;
    }
    this.initGame = initGame();
    console.log(numbers);
}
;

export.b = function Number(word, digit, errorNum, placed) {
    this.digit = digit;
    this.word = word;
    this.placed = placed;
    this.errorNum = errorNum;
}

export.c = function initGame() {
    console.log("initializing");
    var ulText = $('#numName');
    var ulNum = $('#numNumeric');
    for (var i = 0; i < numbers.length; i++) {
        ulText.append('<li id="t' + numbers[i].digit + '">' + numbers[i].word + '</li>');
        ulNum.append('<li id="n' + numbers[i].digit + '">' + numbers[i].digit + '</li>');
        if (numbers[i].placed) {
            $("#n" + i).hide();
        }
    }
    addDragNDrop();
    setInterval(function () {
        $('#timer').html('timer:' + secLeft);
        secLeft--;
    }, 1000);
}

export.d = function addDragNDrop() {
    for (var i = 0; i < this.numbers.length; i++) {
        $("#n" + i).data("index", {index: i});
        $("#t" + i).data("index", {index: i});
        $('#n' + i).draggable();
        $("#t" + i).droppable({drop: function (event, ui) {
                checkPlacement(event, ui, this.id);
            }});
    }
}

export.e = function checkPlacement(event, ui, ti) {
    var ni = ui.draggable.attr("id");
//    var ti = this.id;
    var niElem = $('#' + ni);
    var tiElem = $('#' + ti);
    if (niElem.data("index").index === tiElem.data("index").index) {
        //correct
        niElem.draggable("disable");
        niElem.css("display", "none");
        numbers[niElem.data("index").index].placed = true;
        numCorrect++;
        checkPlacementStatus();
    } else {
        var dimx = $('body').width();
        var dimy = $('body').height();
        var left = Math.floor((Math.random() * (dimx - 20)) + 10);
        var top = Math.floor((Math.random() * (dimy - 20)) + 10);
        niElem.css("left", left + "px");
        niElem.css("top", top + "px");
        numbers[niElem.data("index").index].errorNum++;
    }
    setCookies();
}

export.f = function setCookies() {
    Cookies.set('numbers', numbers, {expires: 128});
    Cookies.set('numCorrect', numCorrect, {expires: 128});
}

export.g = function checkPlacementStatus() {
    if (numCorrect === numbers.length) {
        initSorting();
    }
}

export.h = function initSorting() {
    $('ul').randomize();
    $('#numName').sortable({
        start: function (event, ui) {
        },
        update: function (event, ui) {
            var ordered = 0;
            for (var j = 0; j < numText.length; j++) {
                if ($('#t' + j).index() == j)
                    ordered++;
            }
            if (ordered == numText.length)
                alert("done");
        }
    });
}

export.ı = function checkGameStatus(){
    
}

