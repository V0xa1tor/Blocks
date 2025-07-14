export const useActionMenuStore = defineStore('actionMenu', () => {

  const items = ref<(action | divider)[]>([
    { type: "action", name: "Página inicial", icon: "bi-house", action: { type: "link", to: "/" } },
    { type: "divider" },
    { type: "action", name: "Configurações", icon: "bi-gear", action: { type: "link", to: "/settings" } }
  ]);

  return { items };
});
