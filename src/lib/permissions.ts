/**
 * Who may change the workspace *structure* — renaming, creating and deleting
 * folders, and exporting the layout as source.
 *
 * This is environment-based, not identity-based: the site is fully static with
 * no accounts or backend, so there is no user to authenticate. Editing is
 * enabled while running locally (`npm run dev`) and disabled in the production
 * build, so the deployed site offers no path to it.
 *
 * Note this gates the UI, not secrets. Some of the menu labels still appear as
 * strings in the production bundle — the flag isn't always constant-folded
 * across module boundaries — they're simply never reachable. That's fine here
 * because the tree is session-only client state: there is nothing behind this
 * check worth protecting, and the worst a determined visitor could reach is
 * renaming a folder in their own tab. Do NOT reuse this flag to guard anything
 * that touches real data.
 *
 * That maps onto how the layout actually ships: you arrange things locally,
 * hit "Export layout", and paste the result into src/data/folders.ts. Visitors
 * can still drag icons around — see CAN_REARRANGE below — but only ever in
 * their own tab.
 *
 * If the site ever grows a real backend with logins, this is the single place
 * to swap in a proper session/role check.
 */
export const CAN_EDIT_LAYOUT = process.env.NODE_ENV === "development";

/**
 * Whether the viewer may drag icons around at all.
 *
 * On for everyone. The tree is session state that is never persisted, so a
 * visitor rearranging their desktop changes nothing for anyone else and resets
 * on refresh — it's a bit of desktop-toy fidelity, not an edit to the site.
 */
export const CAN_REARRANGE = true;
