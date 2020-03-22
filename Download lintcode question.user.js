// ==UserScript==
// @name         Download lintcode question
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.lintcode.com/problem/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    // add a new button
    // need jquery https://code.jquery.com/jquery-3.4.1.min.js
    var $ = window.jQuery; // get jquery from the window object
    var buttonStyle = `
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    border: solid 1px #20538D;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);
    -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);
    background: #4479BA;
    color: #FFF;
    padding: 8px 12px;
    text-decoration: none;`

    // function that gets constructs the file name for download
    function contstructFileName() {
        var fileName = $('.problem-modal-description-title').find('h3').text().replace(".", " ");
        var language = $('.problem-editor-modal-language-dropdown.ant-dropdown-trigger').text().trim();
        var extension = '.txt';
        if (language == 'Java') {
           extension = '.java';
        } else if(language == 'Python3' || language == 'Python2') {
           extension = '.py';
        } else if (language == 'JavaScript') {
           extension = '.js';
        } else if (language == 'C++') {
           extension = '.cpp';
        } else {
           extension = '.go';
        }
        fileName += extension;
        return fileName;
    }


    // helper function that constructs file content for me
    function constructFileContent(title) {
        var language = title.split(".")[1];
        var commentStart = language == 'py' ? '"""' : '/*';
        var commentEnd = language == 'py' ? '"""' : '*/';
        var threeNewLines = "\n\n\n";

        // construct the title
        var seperator0 = commentStart + "***************************  TITLE  ****************************" + commentEnd + "\n";
        title = commentStart + title + commentEnd + "\n";

        // construct the descirption
        var seperator1 = threeNewLines + commentStart + "***************************  DESCRIPTION  ****************************" + commentEnd + "\n";
        var description = $(".rendered-markdown.markdown-body.sample-markdown").find("p").first().text();
        description = commentStart + "\n" + description + "\n" + commentEnd + "\n";

        // construct the example
        var seperator2 = threeNewLines + commentStart + "***************************  EXAMPLES  ****************************" + commentEnd + "\n";
        var example = $("code").first().text();
        example = commentStart + "\n" + example + "\n" + commentEnd + "\n";

        // construct the code section
        var seperator3 = threeNewLines + commentStart + "***************************  CODE  ****************************" + commentEnd + "\n";
        var code = "";


        $('.ace_line_group').each(function(i, obj) {
            code += $(obj).text();
            code += "\n";
        });

        var content = seperator0 + title + seperator1 + description + seperator2 + example + seperator3 + code;

        return content;
    }

    // function used to download data(create a new local file)
    function create(text, name, type) {
        var dlbtn = document.getElementById("dlbtn");
        var file = new Blob([text], {type: type});
        dlbtn.href = URL.createObjectURL(file);
        dlbtn.download = name;
    }




    // create button
    var button = document.createElement('a');
    button.setAttribute("id", "dlbtn");
    button.innerHTML = "Download";
    button.style = "top:0;right:0;position:absolute;z-index:99999;padding:20px;" + buttonStyle;
    document.body.appendChild(button);

    // add event listener to the button
    button.addEventListener("click", function() {
        // create file name
        var fileName = contstructFileName();

        // construct file content
        var content = constructFileContent(fileName);

        // download file
        create(content, fileName, 'text/plain');
    });

})();