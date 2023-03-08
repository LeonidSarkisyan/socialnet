<template>
  <div class="form" v-show="showLoginFormTrue">
    <div class="form-title">Авторизация</div>
    <input
        ref="login"
        type="text"
        placeholder="Логин"
        class="input-text"
        v-model="username"
        @keyup.up="this.$refs.password.focus()"
        @keyup.down="this.$refs.password.focus()"
    >
    <input
        @keyup.up="this.$refs.login.focus()"
        @keyup.down="this.$refs.login.focus()"
        ref="password"
        type="text"
        placeholder="Пароль"
        class="input-text"
        v-model="password"
        @keyup.enter="enter"
    >
    <div @click="enter" class="button">
      <span v-if="!isLoading">Войти</span>
      <span class="loader" v-else></span>
    </div>
    <div class="or-login">
      Нет аккаунта? Тогда <span class="login" @click="login">зарегистрируйтесь</span>
    </div>
  </div>
  <div class="form" v-if="showLoginForm" v-show="!showLoginFormTrue">
    <div class="form-title">Регистрация</div>
    <input type="text" placeholder="Логин" class="input-text" v-model="username">
    <input type="text" placeholder="Пароль" class="input-text" v-model="password">

    <div @click="createProfile" class="button">
      Создать профиль
    </div>
    <div class="or-login">
      Уже есть аккаунт? Тогда <span class="login" @click="login">войдите в аккаунт</span>
    </div>
  </div>
  <div class="form" v-else>
        <div class="button" style="margin-bottom: 10px;" @click="createProfile">
          Вернуться назад
        </div>
        <input type="text" placeholder="@Никнейм" class="input-text" v-model="tagName">
        <input type="text" placeholder="Имя" class="input-text" v-model="name">
        <input type="text" placeholder="Фамилия" class="input-text" v-model="surname">
        <input type="text" placeholder="Статус" class="input-text" v-model="status">
        <input type="text" placeholder="Город" class="input-text" v-model="city">
        <input
            type="file"
            placeholder="Загрузите аватарку"
            ref="file"
            v-show="false"
            @change="changeFile"
        >
        <div class="file">
          <div @click="chooseFile" class="button">
            Выбрать аватарку
          </div>
          <div class="file-name" ref="fileName">
            {{ fileName }}
          </div>
        </div>

        <div @click="register" class="button">
          <span v-if="!isLoading">Зарегистрироваться</span>
          <span class="loader" v-else></span>
        </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterForm",
  data() {
    return {
      tagName: '',
      name: '',
      surname: '',
      status: '',
      city: '',
      fileName: 'Вы не загрузили файл',
      forbidden: false,
      username: '',
      password: '',
      showLoginForm: true,
      showLoginFormTrue: true,
      isLoading: false
    }
  },
  methods: {
    verifyBeforeLogin() {
      this.isLoading = true
      if (this.username === '' || this.password === '') {
        console.log('пусто!')
        this.isLoading = false
        return false
      } else {
        return true
      }
    },
    verifyBeforeRegister() {
      if (this.name === '' || this.surname === '' || this.city === '' || this.tagName === '' || this.status === '') {
        this.forbidden = true
      } else {
        this.forbidden = false
      }
    },
    register() {
      this.verifyBeforeRegister()
      if (!this.forbidden) {
        this.isLoading = true
        const newUser = {
          username: this.username,
          password: this.password
        }
        const newProfile = {
          tag_name: this.tagName,
          name: this.name,
          surname: this.surname,
          status: this.status,
          city: this.city,
        }
        this.$emit('register', newUser, newProfile, this.$refs.file.files[0])
      } else {
        alert('Все поля должны быть заполнены, а фотография допустимого разрешения!')
        console.log('Ошибка в форме!')
      }
    },
    chooseFile() {
      this.$refs.file.click()
    },
    changeFile() {
      this.fileName = this.$refs.file.value.split('\\').pop()
      if (!(this.$refs.file.files[0].type === 'image/jpeg' || this.$refs.file.files[0].type === 'image/png')) {
        this.fileName = 'Недопустимый тип файла!'
        this.$refs.fileName.style.color = 'red'
        this.forbidden = true
      } else {
        this.$refs.fileName.style.color = 'green'
        this.forbidden = false
      }
    },
    verifyBeforeCreateProfile() {
      if (this.username === '' || this.password === '') {
        return false
      } else {
        return true
      }
    },
    createProfile() {
      let canCreateProfile = this.verifyBeforeCreateProfile()
      if (canCreateProfile) {
        this.showLoginForm = !this.showLoginForm
      } else {
        console.log('Введите юзернейм и пароль')
      }
    },
    login() {
      this.showLoginFormTrue = !this.showLoginFormTrue
    },
    enter() {
      console.log('Заходим!')
      let canLogin = this.verifyBeforeLogin()
      if (canLogin) {
        this.$emit('enter', this.username, this.password)
      }
    },
    check() {
      this.$emit('check')
    },
    checkToken() {
      this.$emit('checkToken')
    }
  },
  watch: {
    '$store.state.keyLoaderRegisterForm'() {
      console.log('БЛЯЯЯЯЯЯЯ')
      this.isLoading = false
    }
  },
  mounted() {
    if (localStorage.getItem('JTW')) {
      this.$router.push({name: 'profile'})
    }
  }
}
</script>

<style scoped>
  .form {
    width: 375px;
    margin: 60px auto 0;
    padding: 25px 50px 25px 50px;
    background: #252525;
    border-radius: 4px;
  }

  .form-title {
    text-align: center;
    font-size: 28px;
    color: #DC8C40;
    margin-bottom: 10px;
  }

  .or-login {
    margin-top: 20px;
    color: #DC8C40;
  }

  .login {
    text-decoration: underline;
    cursor: pointer;
  }

  .login:hover {
    color: red;
  }

  .input-text {
    display: block;
    width: 360px;
    height: 40px;
    margin-bottom: 10px;
    font-size: 20px;
    color: white;
    background: #383838;
    border-radius: 4px;
    padding-left: 15px;
    transition: 0.15s;
  }

  .input-text:hover {
    background: #545454;
  }

  .input-text:focus {
    background: #b6b6b6;
    color: black;
    font-weight: 700;
  }

  input {
    all: unset;
  }

  .button {
    width: 100%;
    height: 55px;
    color: #F5B06F;
    background: #383838;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.15s;
    font-size: 20px;

    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
  }

  .button:hover {
    background: #545454;
  }

  .file {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
  }

  .file-name {
    color: #DC8C40;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 20px;
  }

  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #ffa95e;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

</style>