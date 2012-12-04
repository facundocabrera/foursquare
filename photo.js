$(function (){

  var file = null;

  $(':file').change(function(){
      file = this.files[0];
  });

  $(':button').click(function(){
    var formData = new FormData($('#photo')[0]);

    debugger;

    $.ajax({
        url: 'https://api.foursquare.com/v2/users/self/update?oauth_token=JIZVPW03C2B3HNDJV504JUWZVGWEQVALYNG4DGSXPBH5HH5V&v=20121110',
        type: 'POST',
        xhr: function() {  // custom xhr
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ // check if upload property exists
                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
            }
            return myXhr;
        },
        // Form data
        data: formData,

        // Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    });
  });

  function progressHandlingFunction(e){
    if(e.lengthComputable){
        $('progress').attr({value:e.loaded,max:e.total});
    }
  }

});