import React, { useState } from 'react';
import "./filterButton.css";

const FilterButton = ({ columns, selectedColumns, onColumnChange, onApplyFilter, onCancelFilter }) => {
    const [tempSelectedColumns, setTempSelectedColumns] = useState(selectedColumns);

    const handleColumnChange = (e) => {
        const { name, checked } = e.target;
        setTempSelectedColumns(prev => ({ ...prev, [name]: checked }));
        onColumnChange(name, checked);
    };

    return (
        <div className='column-selection'>
            <div className='checklist-col-by-fees'>
                {
                    columns.map((col) => {
                        if (!col.excludeFromCSV) {
                            return (<div className='col-checklist-by-fees' key={col.accessor}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name={col.accessor}
                                        checked={tempSelectedColumns[col.accessor]}
                                        onChange={handleColumnChange}
                                    />
                                    {col.Header}
                                </label>
                            </div>);
                        }
                    })
                }
            </div>
            <button onClick={onApplyFilter} className='close-filter-by-fees'>Apply</button>
            <button onClick={onCancelFilter} className='cancel-filter-by-fees'>Cancel</button>
        </div>
    );
};

export default FilterButton;
