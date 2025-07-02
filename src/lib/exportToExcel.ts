import ExcelJS from 'exceljs';

export default function exportQuotesToExcel(quotes) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('daily_quotes');

    worksheet.columns = [
        { letter: 'A', header: 'No', key: 'No' },
        { letter: 'B', header: 'NAME', key: 'NAME' },
    ];

    const rows = quotes.map((quote, index) => ({
        No: quote['No_'],
    }));

    const newRows = worksheet.addRows(rows);
}
