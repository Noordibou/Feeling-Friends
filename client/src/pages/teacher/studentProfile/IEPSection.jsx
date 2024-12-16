import xButton from "../../../images/x-button.png";
import { formatDate } from "../../../utils/dateFormat";
function IEPSection({
  title,
  entries,
  columns,
  editMode,
  onFieldChange,
  onDelete,
  onAdd,
}) {
  return (
    <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-2 sm:px-4 py-4">
      <h2 className="font-header4 text-[20px] pb-4">{title}</h2>
      <table className="w-full text-[14px] md:text-[16px]">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={col.align === "right" ? "text-right" : "text-left"}
              >
                {col.header}
              </th>
            ))}
            {editMode && <th></th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={col.align === "right" ? "text-right px-2" : "px-2"}
                >
                  {editMode ? (
                    col.type === "date" ? (
                      <input
                        type="date"
                        defaultValue={formatDate(entry[col.field])}
                        onChange={(event) =>
                          onFieldChange(event, index, col.field)
                        }
                        className="rounded-md bg-sandwich text-[14px] md:text-[16px] text-right w-full"
                      />
                    ) : (
                      <input
                        type="text"
                        value={entry[col.field]}
                        onChange={(event) =>
                          onFieldChange(event, index, col.field)
                        }
                        className="w-full rounded-md bg-sandwich text-[14px] md:text-[16px] pl-2"
                      />
                    )
                  ) : col.type === "date" ? (
                    formatDate(entry[col.field])
                  ) : (
                    entry[col.field]
                  )}
                </td>
              ))}
              {editMode && (
                <td className="px-2 text-center">
                  <button className="w-4" onClick={() => onDelete(index)}>
                    <img src={xButton} alt="Delete" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {editMode && (
        <button type="button" className="mt-2" onClick={onAdd}>
          Add
        </button>
      )}
    </div>
  );
}

export default IEPSection;
