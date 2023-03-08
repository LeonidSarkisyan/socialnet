import {createStore} from "vuex";

export default createStore ({
    state:() =>{
        return {
            keyLoaderRegisterForm: 0,

            currentActiveChatId: 0,

            countNoCheckChuts: 0,

            tagNameProfile: '',

            idRequestSending: 0,
            idRequest: 0,

            idAcceptSending: 0,
            idAccept: 0,

            idPostDeleted: 0,
            textUpdated: '',
            idNotificationDeleted: 0,
            fetchNotification: 0,
            idGettingRequestFriend: 0,

            countNoViewed: 0
        }
    },
    getters: {

    },
    mutations: {
        setKeyLoaderRegisterForm(state) {
          state.keyLoaderRegisterForm += 1
        },
        nullingCurrentActiveChatId() {
            console.log('Обнулили chat id')
            this.state.currentActiveChatId = 0
        },
        setCurrentActiveChatId(state, number) {
            console.log('Установлён новый chat id =', number)
          state.currentActiveChatId = number
        },
        readOneChut(state, number) {
            if (state.countNoCheckChuts !== 0) {
                state.countNoCheckChuts -= 1
            }
        },
        setCountNoCheckChuts(state, number) {
          state.countNoCheckChuts = number
        },
        setTagNameProfile(state, tagName) {
            state.tagNameProfile = tagName
        },
        setCountNoViewed(state, number) {
          state.countNoViewed = number
          console.log(`Количество непросмотренных уведомлений: ${state.countNoViewed}`)
        },
        clearCountNoViewed(state) {
          state.countNoViewed = 0
          console.log(`Уведомления просмотрены: ${state.countNoViewed}`)
        },
        setAcceptSendingId(state, id) {
          state.idAcceptSending = id
        },
        setAcceptId(state, id) {
            state.idAccept = id
        },
        upIdRequestSending(state, id) {
            state.idRequestSending = id
        },
        setRequestId(state, id) {
          state.idRequest = id
        },
        nullIdReqSend(state) {
          state.idRequest = 0
          state.idRequestSending = 0
        },
        updateFetchNotification(state, id) {
            state.fetchNotification = id
        },
        updateKeyPostList(state, id) {
            state.idPostDeleted = id
        },
        updateTextPost(state, text) {
            state.textUpdated = text
        },
        updateIdDeletedNotification(state, id) {
          state.idNotificationDeleted = id
        },
        nullIdPostDeleted(state) {
            state.idPostDeleted = 0
        },
        nullIdTextPost(state) {
            state.textUpdated = ''
        },
        nullIdDeletedNotification(state) {
            state.idNotificationDeleted = 0
        },
    },
    actions: {

    }
})