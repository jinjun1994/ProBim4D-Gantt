var $ = {
    ajax: function(){
        var ajaxData = {
            type:arguments[0].type || "GET",
            url:arguments[0].url || "",
            async:arguments[0].async || "true",
            data:arguments[0].data || null,
            dataType:arguments[0].dataType || "text",
            contentType:arguments[0].contentType || "application/x-www-form-urlencoded",
            beforeSend:arguments[0].beforeSend || function(){},
            success:arguments[0].success || function(){},
            error:arguments[0].error || function(){}
        };

        ajaxData.beforeSend();
        var xhr = F_ajax.createxmlHttpRequest();
        xhr.responseType=ajaxData.dataType;
        xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);
        xhr.setRequestHeader("Content-Type",ajaxData.contentType);
        xhr.send(F_ajax.convertData(ajaxData.data));
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    ajaxData.success(xhr.response)
                }else{
                    ajaxData.error()
                }
            }
        }
    },

    createxmlHttpRequest: function() {
        if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    },

    convertData: function(data){
        if( typeof data === 'object' ){
            var convertResult = "" ;
            for(var c in data){
                convertResult+= c + "=" + data[c] + "&";
            }
            convertResult=convertResult.substring(0,convertResult.length-1);
            return convertResult;
        }else{
            return data;
        }
    },

    //正则匹配url中相应的参数
    GetQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
};