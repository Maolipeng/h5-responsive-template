import { proxy, snapshot, subscribe } from '@@/plugin-valtio';

export function proxyWithPersist<V>(
  val: V,
  opts: {
    key: string;
  },
) {
  const local = localStorage.getItem(opts.key);
  const state = proxy(local ? JSON.parse(local) : val);
  subscribe(state, () => {
    localStorage.setItem(opts.key, JSON.stringify(snapshot(state)));
  });
  return state;
}
