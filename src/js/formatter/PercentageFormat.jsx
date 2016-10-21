class PercentageFormat {
    
    static format(data, rowData) 
    {
        return (data-0).toFixed(1) + '%';
    }
}

module.exports = PercentageFormat;
