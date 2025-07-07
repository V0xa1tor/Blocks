<template>
  <div class="h-100 d-flex flex-column">
    <div class="overflow-auto w-100 h-100">
      <slot></slot>
    </div>
    <div class="sticky-bottom">
      <hr class="m-0" style="color: var(--bs-border-color); opacity: 1;">
      <HorizontalActionMenu />
    </div>
  </div>
</template>
