var curl = require("curljs");
var dataObject = {firstParam : "first value", secondParam : "second value"};
var curlOpts = curl.opts.silent()
                   .ignore_cert()
                   .follow_redirects()
                   .max_redirs(5)
                   .connect_timeout(3)
                   .post_data(dataObject);

console.log(curl("www.example.com", curlOpts, function(err, data, stderr) );


//curl("www.example.com", curlOpts, function(err, data, stderr) {
//    // do something
//    console.log(data)
//}

