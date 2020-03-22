// ==UserScript==
// @name         Download leetcode question
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://leetcode.com/problems/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==


(function() {
    'use strict';

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

    function get_question_name() {
         return $("div[data-cy='question-title']").text();
    }

    function get_question_description() {
         return $("div[class='content__u3I1 question-content__JfgR']").text();
    }

    function get_language() {
         return $("div[class='ant-select-selection-selected-value']").attr("title");
    }

    function get_code() {
        var res = "";
        $("pre[class=' CodeMirror-line ']").each(function() {
            res += $(this).text();
            res += "\n";
        });
        return res;
    }

    function create_filename(questionName, language) {
         var lan = language.toLowerCase();
         var d = {
             "python": ".py",
             "java": ".java",
             "python3": ".py",
             "ruby": ".rb",
             "javascript": ".js",
             "c++": ".cpp",
             "c": ".c",
             "c#": ".cs",
             "swift": ".swift",
             "c": ".cs",
             "go": ".go",
             "scala": ".scala",
             "kotlin": ".kt",
             "rust": ".rs",
             "php": ".php",
         }

         var extension = d[lan];
        if (typeof extension === 'undefined') {
            extension = ".txt";
        }
        return questionName + extension;
    }

    function create_file_content(title, description, code) {
        var extension = title.split(".")[2];
        var commentStart = extension == 'py' ? '"""' : '/*';
        var commentEnd = extension == 'py' ? '"""' : '*/';
        var threeNewLines = "\n\n\n";

        // construct the title
        var seperator0 = commentStart + "***************************  TITLE  ****************************" + commentEnd + "\n";
        title = commentStart + title + commentEnd + "\n";

        // construct the descirption
        var seperator1 = threeNewLines + commentStart + "***************************  DESCRIPTION  ****************************" + commentEnd + "\n";
        description = commentStart + "\n" + description + "\n" + commentEnd + "\n";

        // construct the example

        // construct the code section
        var seperator3 = threeNewLines + commentStart + "***************************  CODE  ****************************" + commentEnd + "\n";


        var content = seperator0 + title + seperator1 + description + seperator3 + code;

        return content;

    }

    function download_file(text, name, type) {
        var dlbtn = document.getElementById("dlbtn");
        var file = new Blob([text], {type: type});
        dlbtn.href = window.webkitURL.createObjectURL(file);
        dlbtn.download = name;
    }

    $(document).ready(function() {
        // create button
        var button = document.createElement('a');
        button.setAttribute("id", "dlbtn");
        button.innerHTML = "Download";
        button.style = "top:0;right:0;position:absolute;z-index:99999;padding:20px;" + buttonStyle;
        document.body.appendChild(button);

        // add event listener to the button
        button.addEventListener("click", function() {
             var questionName = get_question_name();
             var description = get_question_description();
             var language = get_language();
             var code = get_code();

            // create file name
            var fileName = create_filename(questionName, language);

            // construct file content
            var content = create_file_content(fileName, description, code);

            console.log(content);
            //download the file
            download_file(content, fileName, 'text/plain');

        });

    });

})();