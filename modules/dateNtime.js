module.exports = (date) => {
    let ChatDetail = new Date(date);
    let tempChatDate = ChatDetail.getDate();
    let tempChatMonth = ChatDetail.getMonth() + 1;
    let chatYear = ChatDetail.getFullYear();
    let tempChatHours = ChatDetail.getHours();
    let tempChatMinutes = ChatDetail.getMinutes();
    let tempChatSeconds = ChatDetail.getSeconds();
    let chatDate = (tempChatDate < 10) ? `0${tempChatDate}` : tempChatDate;
    let chatMonth = (tempChatMonth < 10) ? `0${tempChatMonth}` : tempChatMonth;
    let chatHours = (tempChatHours < 10) ? `0${tempChatHours}` : tempChatHours;
    let chatMinutes = (tempChatMinutes < 10) ? `0${tempChatMinutes}` : tempChatMinutes;
    let chatSeconds = (tempChatSeconds < 10) ? `0${tempChatSeconds}` : tempChatSeconds;
    return chatDate + "/" + chatMonth + "/" + chatYear +
        " " + chatHours + ":" + chatMinutes + ":" + chatSeconds;

};