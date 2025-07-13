export const useActionMenuStore = defineStore('actionMenu', () => {

  const items = ref<(action | divider)[]>([
    { type: "action", name: "Texto", icon: "bi-fonts", action: { type: "link", to: "/" } },
    { type: "divider" },
    { type: "action", name: "Configuração", icon: "bi-gear", action: { type: "link", to: "/settings" } }
  ]);

  return { items };
});
