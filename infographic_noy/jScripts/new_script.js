
$(document).ready ( function () {

    $( ".hotspot" ).click(function() {
        $(this).addClass("visited").delay(5000);
        console.log("bitg");
          });

        $( ".parts" ).click(function() {
     
      var x=   $(this).siblings();
            x.addClass("visited");
// console.log( $(this).siblings() )
    });
    
});



