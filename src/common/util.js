export const msg = (message) => {
    uni.showToast({
        title: message,
        icon: 'none'
    });
}
export const toPage = (url) => {
    if (!url) return;
    uni.navigateTo({
        url: url
    });
}
