<template>
  <div class="container my-3">
    <nav>
      <ol class="breadcrumb">
        <li v-for="id in $route.params.id" class="breadcrumb-item">
          <a href="#">{{ id }}</a>
        </li>
      </ol>
    </nav>
  </div>
</template>