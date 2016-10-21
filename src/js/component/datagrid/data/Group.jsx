import DataSummary from "./Summary";

/**
 * @todo implement
 */
class DataGroup {

    construct(options)
    {
        this.summaryRegister = new DataSummary({summaryFields: options.group.summaryFields});
    }

    addRow()
    {

    }
}