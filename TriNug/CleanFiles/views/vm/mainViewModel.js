var client;
(function (client) {
    // Class
    var mainViewModel = (function () {
        function mainViewModel() {
            var self = this;
            this.hostUrl = "http://localhost:8181";
            this.connectionId = "";
            this.socketConnection = io.connect(this.hostUrl);
            this.logs = ko.observableArray([]);
            
            this.setupCallbacks(this.socketConnection);
            
        }
        
        mainViewModel.prototype.setupCallbacks = function (socketConnection) {
            var self = this;
        };

        return mainViewModel;
    })();
    client.mainViewModel = mainViewModel;


})(client || (client = {}));

