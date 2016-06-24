app.controller('ComponentsCtrl', function ($scope, $stateParams, ionicMaterialInk,$http,$ionicPopup) {
    $scope.beli = function (){
      var response = JSON.parse(window.localStorage.getItem("response"));
var dateFormat = function () {
              var    token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
                  timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                  timezoneClip = /[^-+\dA-Z]/g,
                  pad = function (val, len) {
                      val = String(val);
                      len = len || 2;
                      while (val.length < len) val = "0" + val;
                      return val;
                  };

              // Regexes and supporting functions are cached through closure
              return function (date, mask, utc) {
                  var dF = dateFormat;

                  // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
                  if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                      mask = date;
                      date = undefined;
                  }

                  // Passing date through Date applies Date.parse, if necessary
                  date = date ? new Date(date) : new Date;
                  if (isNaN(date)) throw SyntaxError("invalid date");

                  mask = String(dF.masks[mask] || mask || dF.masks["default"]);

                  // Allow setting the utc argument via the mask
                  if (mask.slice(0, 4) == "UTC:") {
                      mask = mask.slice(4);
                      utc = true;
                  }

                  var    _ = utc ? "getUTC" : "get",
                      d = date[_ + "Date"](),
                      D = date[_ + "Day"](),
                      m = date[_ + "Month"](),
                      y = date[_ + "FullYear"](),
                      H = date[_ + "Hours"](),
                      M = date[_ + "Minutes"](),
                      s = date[_ + "Seconds"](),
                      L = date[_ + "Milliseconds"](),
                      o = utc ? 0 : date.getTimezoneOffset(),
                      flags = {
                          d:    d,
                          dd:   pad(d),
                          ddd:  dF.i18n.dayNames[D],
                          dddd: dF.i18n.dayNames[D + 7],
                          m:    m + 1,
                          mm:   pad(m + 1),
                          mmm:  dF.i18n.monthNames[m],
                          mmmm: dF.i18n.monthNames[m + 12],
                          yy:   String(y).slice(2),
                          yyyy: y,
                          h:    H % 12 || 12,
                          hh:   pad(H % 12 || 12),
                          H:    H,
                          HH:   pad(H),
                          M:    M,
                          MM:   pad(M),
                          s:    s,
                          ss:   pad(s),
                          l:    pad(L, 3),
                          L:    pad(L > 99 ? Math.round(L / 10) : L),
                          t:    H < 12 ? "a"  : "p",
                          tt:   H < 12 ? "am" : "pm",
                          T:    H < 12 ? "A"  : "P",
                          TT:   H < 12 ? "AM" : "PM",
                          Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                          o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                          S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                      };

                  return mask.replace(token, function ($0) {
                      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                  });
              };
          }();

        // Some common format strings
        dateFormat.masks = {
            "default":      "ddd mmm dd yyyy HH:MM:ss",
            shortDate:      "m/d/yy",
            mediumDate:     "mmm d, yyyy",
            longDate:       "mmmm d, yyyy",
            fullDate:       "dddd, mmmm d, yyyy",
            shortTime:      "h:MM TT",
            mediumTime:     "h:MM:ss TT",
            longTime:       "h:MM:ss TT Z",
            isoDate:        "yyyy-mm-dd",
            isoTime:        "HH:MM:ss",
            isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };

        // Internationalization strings
        dateFormat.i18n = {
            dayNames: [
                "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
            ],
            monthNames: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ]
        };

        // For convenience...
        Date.prototype.format = function (mask, utc) {
            return dateFormat(this, mask, utc);
        };

      //
      var today = new Date();
      var dataWaktu = today.format("yyyymmddhhMMss");

  		var response = JSON.parse(window.localStorage.getItem("response"));

          var key = 'HGeOPZPy3a7Vz83gVQznSAs33r9X2RVa';
      key = CryptoJS.enc.Utf8.parse(key);
          var iv = CryptoJS.enc.Base64.parse(response.iv); //nilai iv ada di response
          var plaintext = CryptoJS.AES.decrypt(response.password_trx, key, { iv: iv, padding: CryptoJS.pad.ZeroPadding }); //kata merupakan password yg terenkripsi
      // console.log(plaintext.toString());
      //     var text = CryptoJS.enc.Utf8.stringify(plaintext);
      var text = plaintext.toString(CryptoJS.enc.Utf8);

          var res  = response.username_trx;
          var password = text;
      console.log(password);
          var wkt  = dataWaktu;

          // var shaObj = new jsSHA("SHA-1", "TEXT");
          // shaObj.update(''+response.username_trx+text+dataWaktu);
          // var hash = shaObj.getHash("HEX");

          var timestamp = date_php("YmdHis");
          var pass = CryptoJS.SHA1((''+res+password+timestamp)).toString();
          console.log(''+res+password+timestamp);
          console.log(pass);
          var data = {
                     "userid": response.username_trx,
                     "reffid": "Mobile-"+timestamp+"-"+Math.floor(Math.random()*700),
                     "target": $scope.data.notelp,
                     "amount":0,
                     "terminal":"terminal-mobapps-1",
                     "timestamp": timestamp,
                     "sign": pass,
                     "prodName":"TSEL50"
                  };
          // console.log(data);
          var link_beli = "http://103.16.78.45/admin/index.php/api/routers/router";

          $http({
              method: 'POST',
              url: link_beli,
              data: data,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function(res){

              if(res.status==200){
              	if(res.data.status!="FAILED"){
  	            	var alertPopup = $ionicPopup.alert({
  		                title: 'Beli Pulsa Berhasil',
  		                template: 'Selamat anda telah membeli pulsa'
  		            });
              	}else{
              		var alertPopup = $ionicPopup.alert({
  		                title: 'Beli Pulsa Gagal',
  		                template: res.data.message
  		            });
              	}
              }else{
  	            var alertPopup = $ionicPopup.alert({
  	                title: 'Beli Pulsa Gagal',
  	                template: res.data.status
  	            });
              }
          });
    }
});
