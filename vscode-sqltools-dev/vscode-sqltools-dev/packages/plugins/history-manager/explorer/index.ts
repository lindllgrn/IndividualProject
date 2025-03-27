import { EventEmitter, TreeDataProvider,TreeView } from 'vscode';
import { HistoryTreeItem, HistoryTreeGroup } from './tree-items';
import { window } from 'vscode';
import { EXT_NAMESPACE } from '@sqltools/util/constants';
import Context from '@sqltools/vscode/context';

type HistoryExplorerItem = HistoryTreeItem | HistoryTreeGroup;

export class HistoryExplorer implements TreeDataProvider<HistoryExplorerItem> {
  private treeView: TreeView<HistoryExplorerItem>;
  private _onDidChangeTreeData: EventEmitter<HistoryExplorerItem | undefined> = new EventEmitter();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private tree: { [group: string]: HistoryTreeGroup } = {};
  private treeGroupOrder: string[] = [];

  public getTreeItem(element: HistoryExplorerItem): HistoryExplorerItem {
    return element;
  }

  public getChildren(element?: HistoryExplorerItem): HistoryExplorerItem[] {
    if (!element) {
      return this.treeGroupOrder.map(group => this.tree[group]);
    } else if (element instanceof HistoryTreeGroup) {
      return element.items;
    }
    return [];
  }

  public getParent(element: HistoryTreeItem | HistoryTreeGroup) {
    return element.parent || null;
  }
  public refresh = (item?: HistoryExplorerItem) => {
    this._onDidChangeTreeData.fire(item);
  }

  public addItem(group: string, value: string) {
    if (!this.tree[group]) {
      this.tree[group] = new HistoryTreeGroup(group, this.refresh);
    }

    this.treeGroupOrder = [group].concat(this.treeGroupOrder.filter(g => g !== group));
    this.tree[group].addItem(value);
    this.refresh();
  }

  public clear() {
    this.tree = {};
    this.treeGroupOrder = [];
    this.refresh();
  }

  constructor() {
    this.treeView = window.createTreeView<HistoryExplorerItem>(`${EXT_NAMESPACE}ViewHistoryExplorer`, { treeDataProvider: this, showCollapseAll: true });
    Context.subscriptions.push(this.treeView);
  }
}

export default HistoryExplorer;