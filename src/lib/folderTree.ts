import { FolderItem } from "@/types/portfolio";

/** Depth-first lookup of any node by id. */
export function findNode(root: FolderItem, id: string): FolderItem | null {
  if (root.id === id) return root;
  if (root.kind !== "folder") return null;
  for (const child of root.children) {
    const hit = findNode(child, id);
    if (hit) return hit;
  }
  return null;
}

/** True if `ancestorId` contains `nodeId` at any depth (including itself). */
export function contains(root: FolderItem, ancestorId: string, nodeId: string): boolean {
  const ancestor = findNode(root, ancestorId);
  return ancestor ? findNode(ancestor, nodeId) !== null : false;
}

/** Rebuild the tree with `fn` applied to the folder matching `folderId`. */
function mapFolder(
  node: FolderItem,
  folderId: string,
  fn: (folder: Extract<FolderItem, { kind: "folder" }>) => FolderItem
): FolderItem {
  if (node.kind !== "folder") return node;
  if (node.id === folderId) return fn(node);
  return { ...node, children: node.children.map((c) => mapFolder(c, folderId, fn)) };
}

/** Remove a node by id, returning the new tree and the node that was removed. */
function extract(node: FolderItem, id: string): { tree: FolderItem; removed: FolderItem | null } {
  if (node.kind !== "folder") return { tree: node, removed: null };
  let removed: FolderItem | null = null;
  const children: FolderItem[] = [];
  for (const child of node.children) {
    if (child.id === id) {
      removed = child;
      continue;
    }
    const res = extract(child, id);
    if (res.removed) removed = res.removed;
    children.push(res.tree);
  }
  return { tree: { ...node, children }, removed };
}

/** Rename any node. */
export function renameNode(root: FolderItem, id: string, name: string): FolderItem {
  const trimmed = name.trim();
  if (!trimmed) return root;
  const rename = (node: FolderItem): FolderItem => {
    if (node.id === id) return { ...node, name: trimmed };
    if (node.kind !== "folder") return node;
    return { ...node, children: node.children.map(rename) };
  };
  return rename(root);
}

/** Remove a node and everything inside it. */
export function removeNode(root: FolderItem, id: string): FolderItem {
  if (root.id === id) return root; // never delete the root itself
  return extract(root, id).tree;
}

/** Add an empty folder inside `parentId`, returning the tree and the new id. */
export function createFolder(
  root: FolderItem,
  parentId: string,
  name = "New Folder"
): { tree: FolderItem; id: string } {
  const parent = findNode(root, parentId);
  if (!parent || parent.kind !== "folder") return { tree: root, id: "" };

  // Suffix duplicates the way Finder does, so two new folders can coexist.
  const taken = new Set(parent.children.map((c) => c.name));
  let unique = name;
  for (let n = 2; taken.has(unique); n++) unique = `${name} ${n}`;

  const id = `folder-${Math.random().toString(36).slice(2, 9)}`;
  const tree = mapFolder(root, parentId, (folder) => ({
    ...folder,
    children: [...folder.children, { id, name: unique, kind: "folder", children: [] }],
  }));
  return { tree, id };
}

/**
 * Move an existing node into another folder.
 *
 * Refuses to drop a folder into itself or into its own descendant — that would
 * detach the whole subtree from the root and lose it.
 */
export function moveNode(root: FolderItem, itemId: string, targetFolderId: string): FolderItem {
  if (itemId === targetFolderId) return root;
  if (contains(root, itemId, targetFolderId)) return root;

  const target = findNode(root, targetFolderId);
  if (!target || target.kind !== "folder") return root;
  if (target.kind === "folder" && target.children.some((c) => c.id === itemId)) return root;

  const { tree, removed } = extract(root, itemId);
  if (!removed) return root;

  return mapFolder(tree, targetFolderId, (folder) => ({
    ...folder,
    children: [...folder.children, removed],
  }));
}

/** Serialise a node as TypeScript source, for pasting back into folders.ts. */
export function serializeFolder(node: FolderItem, indent = 0): string {
  const pad = "  ".repeat(indent + 1);
  const inner = "  ".repeat(indent + 2);
  const lines = [
    `${indent === 0 ? "" : pad}{`,
    `${inner}id: ${JSON.stringify(node.id)},`,
    `${inner}name: ${JSON.stringify(node.name)},`,
    `${inner}kind: ${JSON.stringify(node.kind)},`,
  ];
  if (node.kind === "app") {
    lines.push(`${inner}appId: ${JSON.stringify(node.appId)},`);
  } else {
    if (node.children.length === 0) {
      lines.push(`${inner}children: [],`);
    } else {
      lines.push(`${inner}children: [`);
      lines.push(node.children.map((c) => serializeFolder(c, indent + 2)).join("\n"));
      lines.push(`${inner}],`);
    }
  }
  lines.push(`${pad}}${indent === 0 ? ";" : ","}`);
  return lines.join("\n");
}
