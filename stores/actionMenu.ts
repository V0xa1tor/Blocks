export const useActionMenuStore = defineStore('actionMenu', () => {

  const items = ref<(action | divider)[]>([
    { type: "action", name: "Texto", icon: "bi-fonts", action: { type: "link", to: "/" } },
    { type: "divider" },
    { type: "action", name: "Banco de dados", icon: "bi-database", action: { type: "link", to: "/configuration/database" } },
    { type: "action", name: "Armazenamento", icon: "bi-archive", action: { type: "link", to: "/configuration/storage" } },
    { type: "action", name: "Customização", icon: "bi-palette", action: { type: "link", to: "/configuration/customization" } },
    { type: "action", name: "Configuração", icon: "bi-gear", action: { type: "link", to: "/configuration" } }
  ]);

  return { items };
});
