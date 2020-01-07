jQuery(document).ready(function() {
    $(".glyphicon.glyphicon-remove.form-control-feedback").click(function(e) {
        e.preventDefault();
        var curInpt = $(this).prev();
        curInpt.val("");
        curInpt.text("");
        return false;
    });
});