//== Class definition

var BootstrapSelect = function () {
    
    //== Private functions
    var demos = function () {
        // minimum setup
        $('.m_selectpicker').selectpicker({
            noneSelectedText : '请选择'//默认显示内容
        });
    }

    return {
        // public functions
        init: function() {
            demos(); 
        }
    };
}();

jQuery(document).ready(function() {    
    BootstrapSelect.init();
});