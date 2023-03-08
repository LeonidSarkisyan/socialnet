<template>
  <div class="group-menu">
    <div class="group-menu-inner">
      <div
          :class="{'group-menu-button-select': selectId === pointMenu.id}"
          :key="pointMenu.id"
          class="group-menu-button"
          v-for="pointMenu in menu"
          @click="selectButton(pointMenu)"
      >
        {{ pointMenu.name }}
      </div>
      <div class="group-menu-create" @click="showModal">
        Создать сообщество
      </div>
    </div>
    <GroupModal
        @closeModal="closeModal"
        v-if="isShowModal"
    />
  </div>
</template>

<script>
import GroupModal from "@/components/GroupComponents/GroupModal";
export default {
  name: "GroupMenu",
  components: {
    GroupModal
  },
  data() {
    return {
      isShowModal: false,
      selectId: 1,
      menu: [
        {id: 1, name: 'Сообщества'},
        {id: 2, name: 'Мои сообщества'},
      ]
    }
  },
  methods: {
    selectButton(pointMenu) {
      this.selectId = pointMenu.id
      this.$emit('selectButton', this.selectId)
    },
    showModal() {
      this.isShowModal = true
    },
    closeModal() {
      this.isShowModal = false
    }
  }
}
</script>

<style scoped>


.group-menu {
  background: #252525;
  width: 910px;
  border-radius: 10px;
  margin-top: 15px;
  margin-left: 350px;
}

.group-menu-inner {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  position: relative;
}

.group-menu-button {
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 40px;
  color: #DC8C40;
  margin-right: 15px;

  cursor: pointer;
  user-select: none;
}

.group-menu-button-select {
  background: #2f2f2f;
}

.group-menu-button:hover {
  background: #2d2d2d;
}

.group-menu-create {
  user-select: none;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 40px;
  color: #ffa95e;
  font-weight: 700;
  background: rgba(75, 75, 75, 0.5);
  position: absolute;
  right: 15px;
}

.group-menu-create:hover {
  background: rgba(75, 75, 75, 0.25);
  color: rgba(255, 155, 56, 0.75);
}
</style>