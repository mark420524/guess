/**  
 * 缓存数据优化  
 * import cache from '@/common/cache'  
 * 使用方法 【  
 *     一、设置缓存  
 *         cache.put('k', '你好', 60);  
 *     二、读取缓存  
 *         cache.get('k','为空时默认值')  
 *     三、移除/清理    
 *         移除: cache.remove('k');  
 *         清理：cache.clear();   
 * 】  
 * @type {String}  
 */
const postfix = 'myapp'; // 缓存前缀   
/**  
 * 设置缓存   
 * @param  {[type]} k [键名]  
 * @param  {[type]} v [键值]  
 * @param  {[type]} t [时间、单位秒]  
 */
function put(k, v, t) {
    uni.setStorageSync(k, v)
    let seconds = parseInt(t);
    if (seconds > 0) {
        let timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000 + seconds;
        uni.setStorageSync(k + postfix, timestamp + "")
    } else {
        uni.removeStorageSync(k + postfix)
    }
}

/**  
 * 获取缓存   
 * @param  {[type]} k   [键名]  
 * @param  {[type]} def [获取为空时默认]  
 */
function get(k, def) {
    let deadtime = parseInt(uni.getStorageSync(k + postfix))
    if (deadtime) {
        if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
            if (def) {
                return def;
            } else {
                return false;
            }
        }
    }
    let res = uni.getStorageSync(k);
    if (res) {
        return res;
    } else {
        if (def == undefined || def == "") {
            def = false;
        }
        return def;
    }
}

//移除指定key缓存
function remove(k) {
    uni.removeStorageSync(k);
    uni.removeStorageSync(k + postfix);
}

//清理缓存
function clear() {
    uni.clearStorageSync();
}

export default {
    put,
    get,
    remove,
    clear
}
