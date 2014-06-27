define(["jstorage"], function() {
    var back = $.jStorage.get("backgroundPageId")
    if(back) {
        function arrayToString(arr) {
            return arr.map(function (item) {
                return item.replace(/(,)/g, "\\$1")
            }).join(",")
        }

        back && back.data && (back.data = arrayToString(back.data))
        $.jStorage.flush()
        $.jStorage.set("backgroundPageId", back)
    }
})