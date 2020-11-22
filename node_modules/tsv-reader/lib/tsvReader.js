const _ = require("lodash");

const fs = require('fs');
const d3 = require('d3-dsv');
const glob = require('glob');

exports.read = function (tsvFilename, column) {
    if (tsvFilename) {
        glob(`${tsvFilename}.{tsv,txt}`, function (err, files) {
            if (err) return err;
    
            if (_.head(files)) {
                const content = fs.readFileSync(_.head(files), "utf8");
                const parsedTsv = d3.tsvParseRows(content);

                const fullTimeWorkers = parsedTsv.filter(worker => worker[2] === "FT");
                const partTimeWorkers = parsedTsv.filter(worker => worker[2] === "PT");
                const managers = parsedTsv.filter(worker => worker[2] === "MG");

                const fullTimesAnnualSalaries = fullTimeWorkers.map(worker => [worker[1], calculateFTAnnualSalary(worker)]);
                const partTimesAnnualSalaries = partTimeWorkers.map(worker => [worker[1], calculatePTAnnualSalary(worker)]);
                const managersAnnualSalaries = managers.map(manager => [manager[1], calculateManagerAnnualSalary(parsedTsv, manager)]);

                if(checkIfManagersExist(managers)) {
                    console.log(fullTimesAnnualSalaries);
                    console.log(partTimesAnnualSalaries);
                    console.log(managersAnnualSalaries);
                } else {
                    console.log(fullTimesAnnualSalaries);
                    console.log(partTimesAnnualSalaries);
                }
            } else {
                console.log('TSV file not found!');
            }
        });
    } else {
        console.log('TSV filename is not specified!');
    }
}

function calculateFTAnnualSalary(worker) {
    const numberOfMonthsInAYear = 12;
    const monthlySalary = _.last(worker);
    return parseInt(monthlySalary) * numberOfMonthsInAYear;
}

function calculatePTAnnualSalary(worker) {
    const numberOfWeeksInAYear = 52;
    const hourlyRate = _.last(worker);
    const numberOfHoursInAWeek = 40;
    return parseInt(hourlyRate) * numberOfHoursInAWeek * numberOfWeeksInAYear;
}

function checkIfManagersExist(managers) {
    return managers !== undefined || managers.length !== 0 || managers !== [];
}

function searchById(arrayOfArrays, arrayOfIds) {
    let items = [];

    arrayOfIds.forEach(id => {
        const item = arrayOfArrays.filter(array => parseInt(array[0]) === parseInt(id));
        items.push(item);
    });

    return items;
}

// Unfinished method
function calculateManagerAnnualSalary(listOfEmployees, manager) {
    const managerDirectReportsIds =  _.last(manager).split(',');
    const managerCompensations = searchById(listOfEmployees, managerDirectReportsIds);
    let total = 0;
    managerCompensations.forEach(worker => {
        if(worker[2] === "FT") {
            total += calculateFTAnnualSalary(worker);
        }

        if(worker[2] === "PT") {
            total += calculatePTAnnualSalary(worker);
        }
    });
    return total;
}