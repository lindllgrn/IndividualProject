import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver';
import { NSDatabase, DatabaseDriver } from '@sqltools/types';

export function DatabaseCompletionItem(database: NSDatabase.IDatabase, priority: number = 1 ): CompletionItem {
  let yml = `Database: ${database.label}\n`;
  return {
    detail: "Database",
    documentation: {
      value: `\`\`\`yaml\n${yml}\n\`\`\``,
      kind: 'markdown',
    },
    kind: CompletionItemKind.Folder,
    label: database.label,
    filterText: database.label,
    sortText: typeof priority === 'number' ? `${priority}:${database.label}` : database.label,
  };
}

export function TableCompletionItem(table: NSDatabase.ITable, priority: number = 1 ): CompletionItem {
  const tableOrView = table.isView ? 'View' : 'Table';
  let yml = `${tableOrView}: ${table.label}\n`;
  if (table.schema) {
    yml += `${tableOrView} Schema: ${table.schema}\n`;
  }
  if (table.database) {
    yml += `Database: ${table.database}\n`;
  }
  return {
    detail: tableOrView,
    documentation: {
      value: `\`\`\`yaml\n${yml}\n\`\`\``,
      kind: 'markdown',
    },
    kind: table.isView ? CompletionItemKind.Reference : CompletionItemKind.Constant,
    label: table.label,
    filterText: table.label,
    sortText: typeof priority === 'number' ? `${priority}:${table.label}` : table.label,
  };
}

export function TableColumnCompletionItem(col: NSDatabase.IColumn, _ignored: { driver?: DatabaseDriver; addTable?: boolean } = {}): CompletionItem {
  const colInfo = [ col.label ];
  if (typeof col.size !== 'undefined' && col.size !== null) {
    colInfo.push(`${col.type.toUpperCase()}(${col.size})`);
  } else {
    colInfo.push(col.type.toUpperCase());
  }
  if (col.isNullable === false) {
    colInfo.push('NOT NULL');
  }
  if (col.defaultValue) {
    colInfo.push('DEFAULT');
    colInfo.push(col.defaultValue);
  }
  let yml = '';
  if (col.database) {
    yml += `Database: ${col.database}\n`;
  }
  // if (col.catalog) {
  //   yml += `Table Catalog: ${col.catalog}\n`;
  // }
  if (col.schema) {
    yml += `Table Schema: ${col.schema}\n`;
  }
  const table = (<NSDatabase.ITable>col.table).label || col.table;
  yml += `Table: ${table}`;
  const label = col.label;
  return <CompletionItem>{
    detail: `${table} Col`,
    documentation: {
      value: `\`\`\`sql\n${colInfo.join(' ')}\n\`\`\`\n\`\`\`yaml\n${yml}\n\`\`\``,
      kind: 'markdown',
    },
    kind: CompletionItemKind.Field,
    label,
    sortText: `-1:${table}.${label}`,
  };
}
