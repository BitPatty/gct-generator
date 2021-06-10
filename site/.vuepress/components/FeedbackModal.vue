<template>
  <transition v-if="showModal" name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div v-if="showModal" class="modal-body">
            <p>
              If you have 5 minutes please fill out our
              <a href="https://forms.gle/WYdGEYARPArd7uYx5" target="_blank">feedback form</a>.
              Thanks!
            </p>
            <div>
              <ButtonComponent
                label="Ok"
                :onClick="
                  () => {
                    this.showModal = false;
                  }
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// Components
import ButtonComponent from './ButtonComponent';

export default {
  name: 'FeedbackModal',
  data() {
    return {
      showModal: false,
    };
  },
  mounted() {
    if (localStorage.getItem('feedback-modal-displayed') !== 'y') {
      this.showModal = true;
      localStorage.setItem('feedback-modal-displayed', 'y');
    }
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-body {
  margin: 20px 0;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
