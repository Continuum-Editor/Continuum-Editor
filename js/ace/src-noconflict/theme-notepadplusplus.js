ace.define("ace/theme/notepadplusplus",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
"use strict";

exports.isDark = false;
exports.cssText = ".ace-notepadplusplus .ace_gutter {\
background: #ebebeb;\
border-right: 1px solid rgb(159, 159, 159);\
color: rgb(136, 136, 136);\
}\
.ace-notepadplusplus .ace_print-margin {\
width: 1px;\
background: #ebebeb;\
}\
.ace-notepadplusplus {\
background-color: #FFFFFF;\
color: black;\
font-weight: normal;\
}\
.ace-notepadplusplus .ace_fold {\
background-color: rgb(60, 76, 114);\
}\
.ace-notepadplusplus .ace_cursor {\
color: black;\
}\
.ace-notepadplusplus .ace_storage,\
.ace-notepadplusplus .ace_keyword,\
.ace-notepadplusplus .ace_variable {\
color: #000;\
}\
.ace-notepadplusplus .ace_constant.ace_buildin {\
color: #0080ff);\
}\
.ace-notepadplusplus .ace_constant.ace_library {\
color: #0080ff;\
}\
.ace-notepadplusplus .ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-notepadplusplus .ace_string {\
color: #8000ff;\
}\
.ace-notepadplusplus .ace_comment {\
color: #008000; font-weight: normal!important;\
}\
.ace-notepadplusplus .ace_comment.ace_doc {\
color: rgb(63, 95, 191);\
}\
.ace-notepadplusplus .ace_comment.ace_doc.ace_tag {\
color: rgb(127, 159, 191);\
}\
.ace-notepadplusplus .ace_constant.ace_numeric {\
color: #000000;\
}\
.ace-notepadplusplus .ace_tag {\
color: rgb(25, 118, 116);\
}\
.ace-notepadplusplus .ace_type {\
color: #000000;\
}\
.ace-notepadplusplus .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-notepadplusplus .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-notepadplusplus .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-notepadplusplus .ace_meta.ace_tag {\
color:rgb(25, 118, 116);\
}\
.ace-notepadplusplus .ace_invisible {\
color: #ddd;\
}\
.ace-notepadplusplus .ace_entity.ace_other.ace_attribute-name {\
color: #ff0000;\
}\
.ace-notepadplusplus .ace_marker-layer .ace_step {\
background: rgb(255, 255, 0);\
}\
.ace-notepadplusplus .ace_active-line {\
background: rgb(232, 242, 254);\
}\
.ace-notepadplusplus .ace_gutter-active-line {\
background-color : #DADADA;\
}\
.ace-notepadplusplus .ace_marker-layer .ace_selected-word {\
border: 1px solid rgb(181, 213, 255);\
}\
.ace-notepadplusplus .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}\
.ace-notepadplusplus .ace_tag {\
color: #0000ff !important;\
}\
.ace-notepadplusplus .ace_tag {\
color: #0000ff !important;\
}\
.ace-notepadplusplus .ace_string.ace_attribute-value.ace_xml {\
font-weight: bold;\
}\
.ace-notepadplusplus .ace_text.ace_xml {\
font-weight: bold;\
}\
.ace-notepadplusplus .ace_constant.ace_language.ace_escape.ace_reference.ace_xml {\
font-style: italic; background-color: lightyellow;\
}\
";

exports.cssClass = "ace-notepadplusplus";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
