<template>
  <div class="group-modal-back">
    <div class="group-modal">
      <div class="group-content">
        <div class="group-title">
          <div>Создание сообщества</div>
          <div class="close" @click="closeModal">&#x2715</div>
        </div>
        <GroupForm/>
      </div>
    </div>
  </div>
</template>

<script>
import GroupForm from "@/components/GroupComponents/GroupForm";
export default {
  name: "GroupModal",
  components: {
    GroupForm
  },
  data() {
    return {

    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    }
  }
}
</script>

<style scoped>
.group-modal-back {
  z-index: 1000;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
}

.group-modal {
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.group-content {
  width: 604px;
  background: #252525;
  border-radius: 10px;
}

.group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  padding: 15px 25px;
  color: white;
  font-size: 18px;
  border-bottom: 1px solid #333333;
}

.close {
  user-select: none;
  cursor: pointer;
  
  font-size: 20px;
  color: gray;
  font-weight: 700;
  transition: 0.15s;
}

.close:hover {
  transform: scale(1.5);
  color: white;
}
</style>