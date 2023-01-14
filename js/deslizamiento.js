$(document).ready(function(){

	$('.menu a').each(function(index, elemento){/* each permite aplicar una funcion anonima a cada enlace a */
		$(this).css({ //a este elemento enlace se le dará estilos css
			'top': '-200px'  //para que los enlaces no se muestren en la pantalla
		});

		$(this).animate({			//a cada enlace se la dará una animación 
			top: '0'				//se mostrarán a su posición correspondiente 
		},1000 + (index * 500));	//tiempo en realizar la animación + el numero del indice del enlace x 500 //1ra-2000, 2da-2500, 3ra-3500, 4ta-40000
	});

	var acercaDe = $('#acercaDe').offset().top;   
		trabajos = $('#trabajos').offset().top,
		contacto = $('#contacto').offset().top,


	$('#btn-acerca-de').on('click', function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: acercaDe
		});
	});
	$('#btn-trabajos').on('click', function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: trabajos
		},1000);
	});

	$('#btn-contacto').on('click', function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: contacto +50
		},1500);
	})



})