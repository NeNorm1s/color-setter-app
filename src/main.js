$(document).ready(function () {
    if ((localStorage.getItem('width') !== null) && (localStorage.getItem('height') !== null)) {
        $('.width').val(localStorage.getItem('width'));
        $('.height').val(localStorage.getItem('height'));
    } else {
        localStorage.setItem('width', 5);
        localStorage.setItem('height', 5);
        $('.width').val(localStorage.getItem('width'));
        $('.height').val(localStorage.getItem('height'));
    };
    if ((localStorage.getItem('color-one') !== null) && (localStorage.getItem('color-two') !== null)) {
        $('#color-one').val(localStorage.getItem('color-one'));
        $('#color-two').val(localStorage.getItem('color-two'));
    } else {
        localStorage.setItem('color-one', "#DA2F2F");
        localStorage.setItem('color-two', "#F2FF38");
        $('#color-one').val(localStorage.getItem('color-one'));
        $('#color-two').val(localStorage.getItem('color-two'));
    };

    $('.first-color .color-box').css('background-color', localStorage.getItem('color-one'));
    $('.last-color .color-box').css('background-color', localStorage.getItem('color-two'));

    function limiter(n, input) {
        if (n > 15) {
            input.val(15);
            return 15;
        };
        if (n < 0) {
            input.val(0);
            return 0;
        };
        return n;
    };

    // Перевод HEX в RGB
    function hexToRgb(hex) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return {r, g, b};
    };

    // Перевод RGB в HEX
    function rgbToHex(r, g, b) {
        return (
            '#' +
            [r, g, b]
                .map(x => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                }).join('')
        );
    };

    // Интерполяция между двумя цветами по коэффициенту t от 0 до 1
    function interpolateColor(color1, color2, t) {
        const c1 = hexToRgb(color1);
        const c2 = hexToRgb(color2);

        const r = Math.round(c1.r + (c2.r - c1.r) * t);
        const g = Math.round(c1.g + (c2.g - c1.g) * t);
        const b = Math.round(c1.b + (c2.b - c1.b) * t);

        return rgbToHex(r, g, b);
    };

    function boxes_setter() {
        $('.main-box').empty();

        let w = limiter(Number($('.width').val()), $('.width'));
        let h = limiter(Number($('.height').val()), $('.height'));

        let v_main = Math.ceil(h / 2);
        let c_main = h;
        let h_main = Math.floor(w - (w / 2));

        for (let y = 0; y < h; y++) {
            const boxes_row = $('<div class="boxes-row"></div>');
            for (let x = 0; x < w; x++) {
                // Коэффициент смешивания зависит от положения (x,y)
                // нумерация в диапазоне 0..1
                let tx = w > 1 ? x / (w - 1) : 0;
                let ty = h > 1 ? y / (h - 1) : 0;

                // Можно усреднить tx и ty, чтобы переход шел по диагонали
                let t = (tx + ty) / 2;

                let boxColor = interpolateColor($('#color-one').val(), $('#color-two').val(), t);
                if ((v_main - 1 == y) && (x == 0)) {
                    $('.v-color .color-box').css('background-color', boxColor);
                } else if ((c_main - 1 == y) && (x == 0)) {
                    $('.c-color .color-box').css('background-color', boxColor);
                } else if ((h - 1 == y) && (h_main == x)) {
                    $('.h-color .color-box').css('background-color', boxColor);
                };
                boxes_row.append($('<div class="color-box"></div>').css('background-color', boxColor));
            };
            boxes_row.css({
                'display': 'grid',
                'grid-template-columns': 'repeat(' + w + ', 50px)',
                'max-height': '750px'
            });
            $('.main-box').append(boxes_row);
        };
        $('html').css({
            'background-image': `linear-gradient(to bottom right, ${$('#color-one').val()}, ${$('#color-two').val()})`,
            'background-repeat': 'no-repeat',
            'background-attachment': 'fixed',
            'background-size': 'cover'
        });
    };

    $('.width, .height').on('input', function () {
        limiter(Number($(this).val()), $(this));
        localStorage.setItem(this.id, $(this).val());
        boxes_setter();
    });
    $('#color-one, #color-two').on('input', function () {
        localStorage.setItem(this.id, $(this).val());
        if (this.id == 'color-one') {
          $('.first-color .color-box').css('background-color', $(this).val());
        } else {
          $('.last-color .color-box').css('background-color', $(this).val());
        }
        boxes_setter();
    });

    boxes_setter(); // отрисовать при загрузке


    function rgbToHexStr(rgb) {
        // извлечение числа из строки
        var result = rgb.match(/\d+/g);
        if (!result || result.length < 3) return null; // если формат неправильный
        // преобразуем в числа
        var r = parseInt(result[0], 10);
        var g = parseInt(result[1], 10);
        var b = parseInt(result[2], 10);
        // функция для преобразования числа в 2-значный HEX
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        // сборка HEX-цвета
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };
    $(document).on('mouseenter', '.color-box', function() {
        var rgbColor = $(this).css('background-color');
        $('.color-hex-code').text(rgbToHexStr(rgbColor).toUpperCase()).show();
    });
    $(document).on('mouseleave', '.color-box', function() {
        $('.color-hex-code').text("").hide();
    });
    $(document).on('click', '.color-box', function() {
        var rgbColor = $(this).css('background-color');
        const hex_str = rgbToHexStr(rgbColor).toUpperCase();

        if (confirm('Вы собираетесь скопировать цвет? ' + hex_str)) {
            const $this = $(this);
            const tempInput = $('<textarea>');
            $('body').append(tempInput);
            tempInput.val(hex_str).select();
            document.execCommand('copy');
            tempInput.remove();
        };
    });

    // <<-- Сохранение скриншота палитры -->>
    $('#save-palette').click(function() {
        if (confirm('Сохранить скриншот палитры? ')) {  
            html2canvas($('.main-box')[0]).then(function(canvas) {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');;
                link.download = 'palette_' + $('#color-one').val().toUpperCase() + '_' + $('#color-two').val().toUpperCase() + '.png';
                link.click();
            });
        };
    });
    // <<-- Сохранение скриншота ряда -->>
    $('#save-row').click(function() {
        if (confirm('Сохранить скриншот ряда? ')) {  
            html2canvas($('.main-colors')[0]).then(function(canvas) {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'row_' + $('#color-one').val().toUpperCase() + '_' + $('#color-two').val().toUpperCase() + '.png';
                link.click();
             });
        };
    });
});