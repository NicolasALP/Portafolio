$(document).ready(function(){

    $(window).scroll(function(){ //aqui accedemos al scroll de la ventana
        var windowWidth = $(window).width();    //ancho de la ventana 

        if(windowWidth > 800){                  //si el ancho de la ventana es mayor a 800px
            var scroll = $(window).scrollTop()  //se esta forma se calcula en que nivel de la página está el scroll / posicion de la pantalla

            $('header .textos').css({
                'transform': 'translate(0px, ' + scroll / 2 + '%)' //0px de izquierda a derecha, de arriba abajo dependerá de scroll(posicionamiento de la pagina en porcentaje)
                                   //translate (0px, 20% ) 2 es igual a 20
            })                          //el 0 para que no se posisione horizontalmente y verticalmente si

            $('.acerca-de article').css({
                'transform' : 'translate(0px, '+ scroll / -4 + '%)'
            })
        }
    })

//de esta forma se regresa el article a su posicion original

    $(window).resize(function(){ //resize, cuando la pantalla cambie de tamaño
        var windowWidth = $(window).width();

        if(windowWidth < 800){
            $('.acerca-de article').css({
                'transform' : 'translate(0px, 0px)'
            });
        }
    });
});