//== Class definition
var BootstrapTouchspin = function() {


    return {
        // public functions
        init: function() {

        },
        initIntegerTouchSpin : function(elementId) {  //整数类型
            // minimum setup
            $(elementId).TouchSpin({
                buttondown_class: 'btn btn-secondary',
                buttonup_class: 'btn btn-secondary',
                verticalbuttons: true,
                verticalupclass: 'la la-angle-up',
                verticaldownclass: 'la la-angle-down',
                min: 0,
                max: 999999,
                boostat: 5,
                maxboostedstep: 10
            });
        },
        initByteTouchSpin : function(elementId) {  //  Byte类型
            // minimum setup
            $(elementId).TouchSpin({
                buttondown_class: 'btn btn-secondary',
                buttonup_class: 'btn btn-secondary',
                verticalbuttons: true,
                verticalupclass: 'la la-angle-up',
                verticaldownclass: 'la la-angle-down',
                min: 0,
                max: 100,
                boostat: 5,
                maxboostedstep: 10
            });
        },
        initDecimalsTouchSpin : function(elementId) {   // 小数类型
            // minimum setup
            $(elementId).TouchSpin({
                buttondown_class: 'btn btn-secondary',
                buttonup_class: 'btn btn-secondary',
                verticalbuttons: true,
                verticalupclass: 'la la-angle-up',
                verticaldownclass: 'la la-angle-down',
                min: 0,
                max: 999999,
                step: 0.1,
                decimals: 2,
                boostat: 5,
                maxboostedstep: 10
            });
        }
    };
}();

jQuery(document).ready(function() {
    BootstrapTouchspin.init();
});