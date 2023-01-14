$(document).ready(function(){

//------------------------------------Efecto menú

	$('.menu a').each(function(index, elemento){/* each permite aplicar una funcion anonima a cada enlace a */
		$(this).css({ //a este elemento enlace se le dará estilos css
			'top': '-200px'  //para que los enlaces no se muestren en la pantalla
		});

		$(this).animate({			//a cada enlace se la dará una animación 
			top: '0'				//se mostrarán a su posición correspondiente 
		},2000 + (index * 500));	//tiempo en realizar la animación + el numero del indice del enlace x 500 //1ra-2000, 2da-2500, 3ra-3500, 4ta-40000
	});

//-----------------------------------Efecto header

	if($(window).width() > 800 ){   //si el ancho de la pantalla es mayor a 800
		$('header .textos').css({   //a los textos del header se le modificará los estilos css
			opacity: 0,				//estas propiedades ocultan los textos
			marginTop: 0			//posiciona desde donde saldrá la caja
		});

		$('header .textos').animate({  	//se le da una animación a los textos
			opacity: 1,					
			marginTop: '-52px'
		},2000);
	}

//_------------------------------Scroll elementos menú
    //offset().top posiciona la la pagína en el lugar asignado
	var acercaDe = $('#acerca-de').offset().top,   
		menu = $('#platillos').offset().top,
		galeria = $('#galeria').offset().top,
		ubicacion = $('#ubicacion').offset().top;

	$('#btn-acerca-de').on('click', function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: acercaDe -100
		},500)
	})

	$('#btn-menu').on('click', function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: menu -80
		},1000)
	})

	$('#btn-galeria').on('click', function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: galeria
		},2000);
	})

	$('#btn-ubicacion').on('click', function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: ubicacion +100
		},3000)
	})
});

