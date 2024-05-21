import { isFunction, omit } from 'lodash';
import { proxy, proxyWithDevtools } from 'umi';

export type FnType<T = any, K = any> = (
  val?: T,
) => K | ((val: T) => Promise<K>);
export type ActionsType = Record<string, FnType>;

export type StoreMap = {
  state: Record<string, any>;
} & ActionsType;

// @ts-ignore
const requireStores = require.context('../store/modules/', true, /\w+\.ts$/);

type StoresMap = Record<string, StoreMap>;

const storesMap: StoresMap = requireStores
  .keys()
  .reduce((res: any, path: string) => {
    const moduleName = path.replace(/\.\/|\.ts/g, '');
    const module = requireStores(path);
    const stateStore = module.default;
    return {
      ...res,
      [moduleName]: stateStore,
    };
  }, {});

console.log('storesMap', storesMap);

type MergeStore = Record<string, Record<string, unknown>>;

const mergeStore: MergeStore = proxy(
  Object.keys(storesMap).reduce(
    (obj, s) => ({ ...obj, [s]: storesMap[s].state }),
    {},
  ),
);

proxyWithDevtools(mergeStore, { name: 'store', enabled: true });

type GetStateStore = (
  type: string,
  stateConf: boolean,
  actionsconf: boolean | string[],
) => any;

export const getModulesStore: GetStateStore = (
  type,
  stateConf = true,
  actionsconf,
) => {
  const moduleStore = storesMap[type];
  const { state, ...actions } = moduleStore;
  let actionList: ActionsType = {};
  if (typeof actionsconf === 'boolean') {
    actionList = actionsconf ? { ...actions } : {};
  } else {
    actionList = actionsconf.reduce(
      (res, item) => ({ ...res, [item]: actions[item] }),
      {},
    );
  }
  return {
    ...(stateConf && { state }),
    ...actionList,
  };
};

type UseStoreState = ({
  module,
}: {
  module: string;
}) => Record<string, unknown>;

export const getStoreState: UseStoreState = ({ module }) => {
  return storesMap[module].state;
};

type UseStateActions = (conf: {
  module: string;
  actions?: string[];
}) => ActionsType;

export const getStateActions: UseStateActions = (conf) => {
  const { module, actions } = conf;
  const actionsMap = omit(storesMap[module], 'state');
  if (!!actions) {
    return actions.reduce(
      (res, item) => ({ ...res, [item]: (actionsMap as ActionsType)[item] }),
      {},
    );
  }
  return actionsMap;
};

type UseClearAction = (conf: {
  namespaces: string[];
  actions: string[];
}) => ActionsType;

export const getClearActions: UseClearAction = (conf) => {
  const { namespaces, actions } = conf;
  const funcs: any[] = [];
  namespaces.forEach((namespace, index) => {
    const fn = storesMap[namespace][actions[index]];
    if (isFunction(fn)) {
      funcs.push(fn);
    }
  });
  const clearStorge = () => {
    funcs.forEach((func) => {
      if (isFunction(func)) {
        console.log('调用六次');
        func();
      }
    });
  };
  return { clearStorge };
};

export default getModulesStore;
