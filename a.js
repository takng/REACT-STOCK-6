//var url = "http://query.yahooapis.com/v1/public/yql";
//var symbol = $("#symbol").val();
//var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");
//
//$.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
//    .done(function (data) {
//
//        console.log (data.query.results.quote.PercentChange );
//
//
//})

var Curl = require( 'node-libcurl' ).Curl;

var curl = new Curl();

curl.setOpt( 'URL', 'http://www.google.com' );
curl.setOpt( 'FOLLOWLOCATION', true );

curl.on( 'end', function( statusCode, body, headers ) {

    console.info( statusCode );
    console.info( '---' );
    console.info( body.length );
    console.info( '---' );
    console.info( this.getInfo( 'TOTAL_TIME' ) );

    this.close();
});

curl.on( 'error', function ( err, errCode ) {

    //do something

    this.close();
});

curl.perform();
