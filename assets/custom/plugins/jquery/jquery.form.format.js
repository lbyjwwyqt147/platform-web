$.fn.setForm = function(jsonValue){
    var obj = this;
    $.each(jsonValue,function(name,ival){
        var $oinput = obj.find("input[name="+name+"]");
        var $textarea = obj.find("textarea[name="+name+"]");
        if($oinput.attr("type")=="checkbox"){
            if(ival !== null){
                var checkboxObj = $("[name="+name+"]");
                var checkArray = ival.split(";");
                for(var i=0;i<checkboxObj.length;i++){
                    for(var j=0;j<checkArray.length;j++){
                        if(checkboxObj[i].value == checkArray[j]){
                            checkboxObj[i].click();
                        }
                    }
                }
            }
        } else if($oinput.attr("type")=="radio"){
            $oinput.each(function(){
                var radioObj = $("[name="+name+"]");
                for(var i=0;i<radioObj.length;i++){
                    if(radioObj[i].value == ival){
                        radioObj[i].click();
                    }
                }
            });
        } else if($oinput.attr("type")=="textarea"){
            $oinput.html(ival);
        } else{
            $oinput.attr("value",ival);
        }
        $textarea.attr("value",ival);
        $textarea.val(ival);
    })
}