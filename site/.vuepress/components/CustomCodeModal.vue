<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <span @click="confirmCancel" class="btn-close">&#215;</span>
        <div class="modal-body">
          <div>
            <label>
              {{ getLabel('codeeditor.fields.title.label') }}
            </label>
            <input
              type="text"
              :placeholder="getLabel('codeeditor.fields.title.placeholder')"
              v-model="title"
            />
          </div>
          <div>
            <label> {{ getLabel('codeeditor.fields.value.label') }}* </label>
            <textarea
              @paste="onPaste"
              @blur="onTouch"
              v-model="customCode"
              :class="touched && !isCodeValid() ? 'invalid' : ''"
              :placeholder="getLabel('codeeditor.fields.value.placeholder')"
            />
          </div>
          <div>
            <ButtonComponent
              :disabled="!isCodeValid()"
              :label="getLabel('codeeditor.save')"
              :onClick="onSubmit"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Util
import { translate } from '../i18n/localeHelper';

export default {
  props: {
    identifier: { type: String, required: false },
    initialTitle: { type: String, required: false },
    initialValue: { type: String, required: false },
    onCancel: { type: Function },
    onSave: { type: Function },
  },
  data() {
    return {
      title: this.initialTitle,
      customCode: this.initialValue,
      touched: this.initialValue != null,
    };
  },
  methods: {
    getLabel(key) {
      return translate(key, this.$lang);
    },
    isCodeValid() {
      if (!this.customCode) return false;
      const formattedCode = this.customCode.replace(/(?:\r|\n|\s)/g, '');
      return /^[a-fA-F0-9]+$/.test(formattedCode) && formattedCode.length % 16 === 0;
    },
    onTouch() {
      this.touched = true;
    },
    confirmCancel() {
      if (!confirm(translate('common.discard', this.$lang))) return;
      this.onCancel();
    },
    onSubmit() {
      this.onSave(
        this.identifier,
        this.title ? this.title : 'N/A',
        this.customCode.replace(/[^a-zA-Z0-9]/g, ''),
      );
    },
    onPaste(e) {
      e.stopPropagation();
      e.preventDefault();
      const pasteContent =
        e.clipboardData?.getData?.('text') || window.clipboardData?.getData?.('text');

      if (!pasteContent) return;

      const newCode = `${this.customCode ? this.customCode : ''} ${pasteContent}`
        .replace(/(?:\t|\s)/g, '')
        .replace(/(.{8})(.{8})/g, '$1 $2\r\n');
      this.customCode = newCode;
    },
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
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  width: 300px;
  margin: 0px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
.btn-close {
  position: absolute;
  font-size: 1.2em;
  right: 20px;
  top: 10px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}
.modal-body > div:not(:last-child) {
  margin-bottom: 10px;
}
.modal-body > div > label {
  display: block;
  color: #727272;
  font-size: 0.8em;
  margin-bottom: 3px;
}
.modal-body > div > input,
.modal-body > div > textarea {
  box-sizing: border-box;
  width: 100%;
  display: block;
}
.modal-body > div > textarea {
  resize: vertical;
}
.modal-body > div > textarea.invalid {
  border: 1px solid red;
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