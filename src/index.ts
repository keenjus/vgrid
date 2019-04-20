//@ts-ignore
import VGrid from "./VGrid.vue";

export default VGrid;

export function install(Vue: any) {
  if((install as any).installed) return;
  (install as any).installed = true;
  Vue.component("VGrid", VGrid);
}

const plugin = {
  install,
};

let GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = (window as any).Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = (global as any).Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

export * from "./interfaces";
export * from "./templates";