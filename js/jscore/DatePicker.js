jsc.DatePicker = function(targetEl){
    var self = this;

    self.targetEl = targetEl;

    self.el = document.createElement("div");
    self.el.className = "gldp-default";
};

jsc.DatePicker.prototype.render = function(target){
    var self    = this;
    var $target = $(target);

    self.update();

    document.body.appendChild(self.el);

    $target.on("keyup", function(event){
        var d = new Date(this.value);
        if(Object.prototype.toString.call(d) === "[object Date]" ) {
            if(!isNaN(d.getTime())){
                self.theDate = d;
                self.selectedDate = d;
                self.update();
            }
        }
    });

    $target.on("blur", function(event){
        self.hide();
    });

    $(self.el).hover(function(){
        $target.off("blur");
    }, function(){
        $target.on("blur", function(event){
            self.hide();
        });
    });

    $(self.el).css({
        "position": "absolute",
        "left": $target.offset().left,
        "top": $target.offset().top+$target.outerHeight(true)
    });

    $(self.el).slideDown(200);
};

jsc.DatePicker.prototype.hide = function(){
    var self = this;

    $(self.el).slideUp(200);

    if(self.el.parentNode){
        self.el.parentNode.removeChild(self.el);
    }
};

jsc.DatePicker.prototype.update = function(){
    var self = this;

    var startDate = new Date();

    startDate.setDate(1);
    startDate.setHours(0,0,0,0);

    // used to determine if prev button is shown
    var startTime = startDate.getTime();

    var endDate = new Date(0);
    endDate.setHours(0,0,0,0);

    // used to determine if next button is shown
    var endTime = endDate.getTime();

    if(self.selectedDate === undefined){
        self.selectedDate = new Date();
        self.selectedDate.setHours(0,0,0,0);
    }
    var selectedTime = self.selectedDate.getTime();

    self.theDate = (self.theDate === undefined) ? startDate : self.theDate;

    // get first date of the current month being rendered
    self.firstDate = new Date(self.theDate);
    self.firstDate.setDate(1);

    var firstTime = self.firstDate.getTime();

    /*
    * calculate last date of the month
    * by starting with the frist date of current month, 
    * add a month, then back the day up, by using zero
    */
    var lastDate = new Date(self.firstDate);
    lastDate.setMonth(lastDate.getMonth()+1);
    lastDate.setDate(0);

    var lastTime = lastDate.getTime();
    var lastDay = lastDate.getDate();

    var prevDateLastDay = new Date(self.firstDate);
    prevDateLastDay.setDate(0);
    prevDateLastDay = prevDateLastDay.getDate();

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var weekRowCount = 5;

    var firstDay = self.firstDate.getDay();

    if((firstDay === 5 && lastDay > 30) || (firstDay === 6 && lastDay >= 30)) weekRowCount = 6;

    var days = "";
    for(var y = 0, i = 0; y < weekRowCount; y++){
        var row = "";

        for(var x = 0; x < 7; x++, i++){
            var p = ((prevDateLastDay - self.firstDate.getDay()) + i + 1);
            var n = p - prevDateLastDay;
            var c = (x === 0) ? "sun" : ((x === 6) ? "sat" : "day");

            if(n >= 1 && n <= lastDay){
                var today = new Date(); today.setHours(0,0,0,0);
                var date = new Date(self.theDate); date.setHours(0,0,0,0); date.setDate(n);
                var dateTime = date.getTime();

                c = (today.getTime() == dateTime) ? "today":c;

                if(self.selectedDate)
                {
                    c = (dateTime === selectedTime) ? "selected" : c;
                }

            } else {
                c = "noday"; // Prev/Next month dates are non-selectable by default
                n = (n <= 0) ? p : ((p - lastDay) - prevDateLastDay);
            }

            row += "<td class='gldp-days "+c+" **-"+c+"'><div class='"+c+"'>"+n+"</div></td>";
        }

        days += "<tr class='days'>"+row+"</tr>";
    }

    // TODO: implement a start date and end date for rescricting user input
    //var showP = (startTime < firstTime);
    var showP = true;
    var showN = (lastTime < endTime) || (endTime < startTime);

    var titleMonthYear = monthNames[self.theDate.getMonth()]+" "+self.theDate.getFullYear();

    var html =
        "<table>"+
            "<tr>"+ /* Prev Month/Year Next*/
                ("<td class='**-prevnext prev'>"+(showP ? "◄":"")+"</td>")+
                "<td class='**-monyear' colspan='5'>{MY}</td>"+
                ("<td class='**-prevnext next'>"+(showN ? "►":"")+"</td>")+
            "</tr>"+
            "<tr class='**-dow'>"+ /* Day of Week */
                "<td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td>"+
            "</tr>"+days+
        "</table>";

    html = (html.replace(/\*{2}/gi, "gldp-default")).replace(/\{MY\}/gi, titleMonthYear);

    $(self.el).html(html);

    var $nodes = $("tr.days td:not(.noday, .selected)", self.el);

    $nodes.click(function(event){
        event.stopPropagation();
        var day = $(this).children("div").html();
        var newDate = self.theDate;
        newDate.setDate(day);
        self.selectedDate = newDate;
        $(self.targetEl).val((newDate.getMonth()+1)+"/"+newDate.getDate()+"/"+newDate.getFullYear());
        self.hide();
    });

    $(window).bind("click", function(e){
        event.stopPropagation();
        self.hide();
    });

    $("[class*=-prevnext]", self.el).click(function(e){
        e.stopPropagation();

        // Determine offset and set new date
        var offset = $(this).hasClass("prev") ? -1 : 1;
        var newDate = new Date(self.firstDate);
        newDate.setMonth(self.theDate.getMonth()+offset);

        self.theDate = newDate;
        self.update();
    });
};

jsc.DatePicker.attachTo = function(selector){
    $(selector).each(function(index, node){
        var dp = new jsc.DatePicker(node);
        $(node).on("click", function(event){
            event.stopPropagation();
            dp.render(this);
        });
    });

    return $(selector);
};

