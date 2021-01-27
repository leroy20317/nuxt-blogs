<template>
  <div class="cover-loading">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cover-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .spinner {
    width: 40px;
    height: 40px;

    position: relative;
  }

  .double-bounce1,
  .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #38f;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;

    animation: bounce 2s infinite ease-in-out;
  }

  .double-bounce2 {
    animation-delay: -1s;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
}
</style>
