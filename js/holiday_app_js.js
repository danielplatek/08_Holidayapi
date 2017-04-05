document.addEventListener('DOMContentLoaded', function (e) {

    // variables for DOM
    var select = document.querySelector('select');
    var h3     = document.querySelector('h3');

    //variables for url
    var country = '?country=PL';
    var year = '&year=2016';
    var key = '&key=ea995824-6556-46e6-a4f9-ee640f84dbbc';
    var holidayUrl = 'https://holidayapi.com/v1/holidays' + country + year + key;

/* API data:

    "status": 200,
        "holidays": {
        "2016-01-01": [
            {
                "name": "Durin's Day",
                "date": "2016-01-01",
                "observed": "2016-01-01",
                "public": true
            }
        ],
*/

    function insertData(holiday) {
        var holidays = holiday.holidays;
        var optgroup;
        var prevMonth = '';

        for(var key in holidays) {
            var holidayDate = holidays[key];
            for(var i in holidayDate) {
                var date = holidayDate[i].date;

                //division of the date: year, month, day
                var dateSplit = date.split('-');

                //year and month required for sorting holidays of one month
                var month = dateSplit[0] + '-' + dateSplit[1];

                //If the previous month is different from the current one, create an optgroup item with a label attribute with the current month
                if(prevMonth !== month) {
                    //Condition for first date
                    if(prevMonth !== '') {
                        select.appendChild(optgroup);
                    }

                    //Add new optgroup with month
                    optgroup = document.createElement('optgroup');
                    optgroup.setAttribute('label', month);
                }

                //else, add holidays to an existing group
                var option = document.createElement('option');
                option.setAttribute('data-value', dateSplit);
                option.innerText = date;

                optgroup.appendChild(option);

                //Updated month
                prevMonth = month;
            }
        }
        select.appendChild(optgroup);
    }

    function showHolidayName(date, allDates) {
        var holidayName = '';
        var holidays = allDates.holidays;

        for(var index in holidays[date]){
            var value = holidays[date][index];
            holidayName += value.name;
        }
        h3.innerText = holidayName;
    }

    function ajax(url) {
        return new Promise((resolve, reject) => {
            var req = new XMLHttpRequest();
            req.open('GET', url, true);

            req.onload = () => req.status === 200 && req.readyState == 4 ?
                insertData(JSON.parse(req.response)) &
                showHolidayName(select.value, JSON.parse(req.response)) &

                select.addEventListener('change', function(){
                    showHolidayName(this.value, JSON.parse(req.response));
                })

                : reject(Error(req.statusText));

            req.onerror = (e) => reject(console.log('conection error'));
            req.send();
        });
    }
    ajax(holidayUrl);
});