jQuery.fn.putCursorAtEnd = function() {

    return this.each(function() {

        // Cache references
        var $el = $(this),
            el = this;

        // Only focus if input isn't already
        if (!$el.is(":focus")) {
            $el.focus();
        }

        // If this function exists... (IE 9+)
        if (el.setSelectionRange) {

            // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
            var len = $el.val().length * 2;

            // Timeout seems to be required for Blink
            setTimeout(function() {
                el.setSelectionRange(len, len);
            }, 1);

        } else {

            // As a fallback, replace the contents with itself
            // Doesn't work in Chrome, but Chrome supports setSelectionRange
            $el.val($el.val());

        }

        // Scroll to the bottom, in case we're in a tall textarea
        // (Necessary for Firefox and Chrome)
        this.scrollTop = 999999;

    });

};

var template = '<p role="textbox" contenteditable="true" class="paragraph-input border-0"> <span data-placeholder="Start writing or type / to choose a block"></span> </p>';
var template2 = '<span data-placeholder="Start writing or type / to choose a block"></span>';
var position = $('.paragraph-input').position();
var visited = false;
var movingSelector = "";



$(document).on('click', '.paragraph-input', function(e) {
    $(this).children('span').remove();

});

$(document).on('focusout', '.paragraph-input', function(e) {
    var temp = $(this).html();
    if (!temp) {
        $(this).append(template2);
    }
});

$(document).on('focus', '.paragraph-input', function(event) {
    visited = true;
    movingSelector = $(this);
    $(this).children('span').remove();
    position = $(this).position();
    $('.popover-slot').removeClass('d-none');
    $('.popover-slot div').css({ top: position.top - 70 });
    console.log(position);
});

$('body').on('mousemove', function(event) {
    if (visited) {
        $('.popover-slot').removeClass('d-none');
    }
});



$(document).on('keydown', '.paragraph-input', function(e) {
    if ((e.keyCode == 13 && !e.shiftKey)) {
        e.stopPropagation()
        $(template).insertAfter(this);
        textboxes = $("p");
        currentBoxNumber = textboxes.index(this);
        console.log(textboxes.index(this));
        if (textboxes[currentBoxNumber + 1] != null) {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
            // nextBox.select();
            event.preventDefault();
            return false;
        }

    }

    if (e.keyCode == 8) {
        var temp = $(this).html();
        if (!temp) {
            $(this).remove();
            currentBoxNumber = textboxes.index(this);
            if (textboxes[currentBoxNumber - 1] != null) {
                nextBox = textboxes[currentBoxNumber - 1];
                nextBox.focus();

                // nextBox.putCursorAtEnd() // should be chainable
                // .on("focus", function() { // could be on any event
                //   searchInput.putCursorAtEnd()
                // });

                // nextBox.select();
                event.preventDefault();
                return false;
            }

        }

    }
    $('.popover-slot').addClass('d-none');

});

$('.entry-title textarea').on('click', function() {
    visited = false;
    $('.popover-slot').addClass('d-none');
});


$('#btn-mining').on('click', function() {
    $('p').each(function() {
        $(this).removeAttr('role contenteditable')
        $(this).removeClass('paragraph-input')
    })
    var entryContent = $('.entry-content').html();
    var title = $('.entry-title textarea').val();
    var entryTitle = '<h1>' + title + '</h1>';

    $('.entry-content').append(entryContent);
    $('.entry-title').append(entryTitle);

    var html_text = entryTitle + entryContent;

    console.log(html_text);
});


function ChangeText(selector, openTag, closeTag) {


    var textArea = $(selector);
    var len = textArea.html().length;
    var start = window.getSelection().getRangeAt(0).startOffset;
    var end = window.getSelection().getRangeAt(0).endOffset;
    var selectedText = window.getSelection().toString();
    console.log(selectedText);
    var begin = textArea.html().substring(0, start);
    var final = textArea.html().substring(end, len);

    var replacement = openTag + selectedText + closeTag;
    textArea.html(begin + replacement + final);
}

$('#btnBold').on('click', function() {
    ChangeText(movingSelector, "<b>", "</b>");
});
$('#btnItalic').on('click', function() {
    ChangeText(movingSelector, "<i>", "</i>");
});
$('#btnUnderline').on('click', function() {
    ChangeText(movingSelector, "<u>", "</u>");
});