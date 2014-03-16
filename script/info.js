function kidcoder_info(did, fnc) {
  var did_txt = $(did).get("text") + " Clique para continuar.";
  $(did).set("text", "");
  $(did).setStyle("color", "#ffffff");
  var did_prg = 0;
  var did_fin = did_txt.length;
  var did_int = window.setInterval(function() {
	  if (did_prg < did_fin -1) {
		  did_prg++;
		  $(did).appendText(did_txt[did_prg]);
	  } else {
		  window.clearInterval(did_int);
		  $(did).addEvent("click", function() {
			  $(did).tween("margin-left", -630);
			  setTimeout(fnc, 1000);
		  });
	  }
  }, 70);
}

function kidcoder_congratulate(did, fnc) {
  $(did).appendText(" Clique para continuar.");
  $(did).setStyle("margin-top", -500);
  $(did).setStyle("color", "#ffffff");
  $(did).tween("margin-top", 0);
  $(did).addEvent("click", function() {
	  $(did).tween("margin-top", -500);
	  setTimeout(fnc, 1000);
  });
}
