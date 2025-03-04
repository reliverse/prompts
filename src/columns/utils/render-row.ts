import stringWidth from "string-width";
import wrapAnsi from "wrap-ansi";

import type { Row, InternalColumnMeta } from "~/columns/types.js";

import { getTerminalWidth } from "~/main.js";

import { getLongestLineWidth } from "./get-longest-line-width.js";

const emptyLines = (length: number) =>
  Array.from({ length }).fill("") as string[];

export function renderRow(
  rowColumns: InternalColumnMeta<number>[][],
  rowData: Row,
) {
  const subRows: string[] = [];

  let columnIndex = 0;
  for (const subRow of rowColumns) {
    let maxLines = 0;

    const subRowWithData = subRow.map((column) => {
      let cellText = rowData[columnIndex] ?? "";
      columnIndex += 1;

      if (column.preprocess) {
        cellText = column.preprocess(cellText);
      }

      const adjustedWidth = getTerminalWidth(column.width);
      if (getLongestLineWidth(cellText) > adjustedWidth) {
        cellText = wrapAnsi(cellText, adjustedWidth, {
          hard: true,
        });
      }

      let lines = cellText.split("\n");

      if (column.postprocess) {
        const { postprocess } = column;
        lines = lines.map((line, lineNumber) =>
          postprocess.call(column, line, lineNumber),
        );
      }

      if (column.paddingTop) {
        lines.unshift(...emptyLines(column.paddingTop));
      }

      if (column.paddingBottom) {
        lines.push(...emptyLines(column.paddingBottom));
      }

      if (lines.length > maxLines) {
        maxLines = lines.length;
      }

      return {
        ...column,
        lines,
        adjustedWidth,
      };
    });

    const rowLines: string[] = [];
    for (let i = 0; i < maxLines; i += 1) {
      const rowLine = subRowWithData
        .map((column) => {
          const cellLine = column.lines[i] ?? "";

          const lineFiller = Number.isFinite(column.width)
            ? " ".repeat(column.adjustedWidth - stringWidth(cellLine))
            : "";
          let text = column.paddingLeftString;

          if (column.align === "right") {
            text += lineFiller;
          }

          text += cellLine;

          if (column.align === "left") {
            text += lineFiller;
          }

          return text + column.paddingRightString;
        })
        .join("");

      rowLines.push(rowLine);
    }

    subRows.push(rowLines.join("\n"));
  }

  return subRows.join("\n");
}
