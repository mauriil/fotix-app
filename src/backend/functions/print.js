let Printer = require('node-printer');
let fs = require('fs');

// Get available printers list
// let listPrinter = Printer.list();
// console.log("🚀 ~ listPrinter:", listPrinter)

// HP_DeskJet_2130_series

// Create a new Pinter from available devices
let printer = new Printer('HP_DeskJet_2130_series');

const printImage = (imagePath) => {
    // // Print from a buffer, file path or text
    let fileBuffer = fs.readFileSync(imagePath);
    let jobFromBuffer = printer.printBuffer(fileBuffer);

    // // Listen events from job
    jobFromBuffer.once('sent', function () {
        jobFromBuffer.on('completed', function () {
            console.log('Job ' + jobFromBuffer.identifier + 'has been printed');
            jobFromBuffer.removeAllListeners();
        });
    });
}

module.exports = printImage;
