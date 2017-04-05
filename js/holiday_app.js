$(function() {

    // variables for DOM
    var $select = $("select");
    var $h1 = $("h1");

    //variables for url
    var country = '?country=PL';
    var year = '&year=2016';
    var key = '&key=be8c0125-ded4-4172-85da-a347a71e2d53';
    var holidayUrl = 'https://holidayapi.com/v1/holidays' + country + year + key;

    function insertData(holidays) {

        var optgroup;
        var prevMonth = '';

        $.each(holidays, function(index, value) {

            //division of the date: year, month, day
            var arr = index.split('-');

            //year and month required for sorting holidays of one month
            var month = arr[0] + '-' + arr[1];
            console.log('prevMonth: '+ prevMonth, 'month: '+ month);

            //If the previous month is different from the current one, create an optgroup item with a label attribute with the current month
            if(prevMonth !== month) {

                //Condition for first date
                if(prevMonth !== '') {
                    $select.append(optgroup);
                }
                //Add new optgroup with month
                optgroup = $('<optgroup>').attr('label', month);
            }
            //else, add holidays to an existing group
            var option = $('<option>').attr('value', index).text(index);
            optgroup.append(option);

            //Updated month
            prevMonth = month;
        });

        $select.append(optgroup);
    }

    function showHolidayName(date, allDates) {
        var holidayName = '';

        //From each date download the name and assign to the holidayName
        $.each(allDates[date], function(index, value){
            holidayName += value.name;
        });

        $h1.text(holidayName);
    }

    $.ajax({
        url: holidayUrl,
    }).done(function(response){
        insertData(response.holidays);

        //Show the name of the holiday for the first date
        showHolidayName($select.val(), response.holidays);

        //Show the name of the holiday for the selected date
        $select.on('change', function(){
            showHolidayName($(this).val(), response.holidays);
        });

        console.log(response);

    }).fail(function(error){
        console.log(error);
    });
});
