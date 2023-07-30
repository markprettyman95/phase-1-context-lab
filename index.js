function createEmployeeRecord([firstName, familyName, title, payPerHour]) {
    return {
        firstName,
        familyName,
        title,
        payPerHour,
        timeInEvents: [],
        timeOutEvents: [],
        allWagesFor() {
            const eligibleDates = this.timeInEvents.map((e) => e.date);
            const payable = eligibleDates.reduce(
                (total, date) => total + wagesEarnedOnDate(this, date),
                0
            );
            return payable;
        },
    };
}

function createEmployeeRecords(data) {
    return data.map(createEmployeeRecord);
}

function createTimeInEvent(employee, dateStamp) {
    const [dateStr, timeStr] = dateStamp.split(" ");
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minutes] = timeStr.split(":").map(Number);

    const date = new Date(year, month - 1, day, hour, minutes);
    if (isNaN(date.getTime())) {
        throw new Error(
            "Invalid dateStamp format. Expected 'YYYY-MM-DD HH:MM'."
        );
    }

    employee.timeInEvents.push({
        type: "TimeIn",
        date: date.toLocaleDateString(),
        hour: date.getHours(),
    });
    return employee;
}

function createTimeOutEvent(employee, dateStamp) {
    const [dateStr, timeStr] = dateStamp.split(" ");
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minutes] = timeStr.split(":").map(Number);

    const date = new Date(year, month - 1, day, hour, minutes);
    if (isNaN(date.getTime())) {
        throw new Error(
            "Invalid dateStamp format. Expected 'YYYY-MM-DD HH:MM'."
        );
    }

    employee.timeOutEvents.push({
        type: "TimeOut",
        date: date.toLocaleDateString(),
        hour: date.getHours(),
    });
    return employee;
}

function hoursWorkedOnDate(employee, date) {
    const timeInEvent = employee.timeInEvents.find(
        (event) => event.date === date
    );
    const timeOutEvent = employee.timeOutEvents.find(
        (event) => event.date === date
    );

    if (!timeInEvent || !timeOutEvent) {
        throw new Error("Invalid date or missing timeIn/timeOut events.");
    }

    return (timeOutEvent.hour - timeInEvent.hour) / 100;
}

function wagesEarnedOnDate(employee, date) {
    const hoursWorked = hoursWorkedOnDate(employee, date);
    return hoursWorked * employee.payPerHour;
}

function findEmployeeByFirstName(employees, firstName) {
    return employees.find((employee) => employee.firstName === firstName);
}

function calculatePayroll(employees) {
    return employees.reduce(
        (totalPayroll, employee) => totalPayroll + employee.allWagesFor(),
        0
    );
}

/*
 We're giving you this function. Take a look at it, you might see some usage
 that's new and different. That's because we're avoiding a well-known, but
 sneaky bug that we'll cover in the next few lessons!

 As a result, the lessons for this function will pass *and* it will be available
 for you to use if you need it!
 */

const allWagesFor = function () {
    const eligibleDates = this.timeInEvents.map(function (e) {
        return e.date;
    });

    const payable = eligibleDates.reduce(
        function (memo, d) {
            return memo + wagesEarnedOnDate.call(this, d);
        }.bind(this),
        0
    ); // <== Hm, why did we need to add bind() there? We'll discuss soon!

    return payable;
};
