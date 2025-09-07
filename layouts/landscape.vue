<template>
  <div class="overflow-auto h-100 hstack">
    <SideActionMenu />
    <div class="vr" style="color: var(--bs-border-color); opacity: 1;"></div>
    <div class="overflow-auto w-100 h-100 hstack">
      <slot></slot>
    </div>
  </div>
</template>
