var theme = "twilight"; // we can add more themes later
var prompt = "//the prompt goes here"
var editor = ace.edit("editor");

editor.setTheme("ace/theme/"+theme);
editor.getSession().setMode("ace/mode/javascript");
editor.setValue(prompt);

$(document).on('ready', function(){
  $('#reset').on('click', function(){
    editor.setValue(prompt);
  });

  $('#submit').on('click', function(){
    var testThisCode = editor.getValue();
    console.log("this needs to be evaluated!: ", testThisCode);
  });
  
  $('#theme').on('change', function(){
    var theme = $('#theme').val();
    editor.setTheme("ace/theme/"+theme);
  });

});