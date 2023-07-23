document.oncontextmenu = (event) => {
    if (event.target && event.target.tagName.toLowerCase() === 'input' && (event.target.type.toLowerCase() === 'text' || event.target.type.toLowerCase() === 'password'))
        return;
    else {
        event.preventDefault(); event.stopPropagation(); return false;
    }
};
Date.prototype.toJSON = function () {
    let tz = this.getTimezoneOffset();
    let sign = tz > 0 ? '-' : '+';
    let tzHrs = Math.floor(Math.abs(tz) / 60).fmt('00');
    let tzMin = (Math.abs(tz) % 60).fmt('00');
    return `${this.getFullYear()}-${(this.getMonth() + 1).fmt('00')}-${this.getDate().fmt('00')}T${this.getHours().fmt('00')}:${this.getMinutes().fmt('00')}:${this.getSeconds().fmt('00')}.${this.getMilliseconds().fmt('000')}${sign}${tzHrs}${tzMin}`;
};
Date.prototype.fmt = function (fmtMask, emptyMask) {
    if (fmtMask.match(/[hHmt]/g) !== null) { if (this.isDateTimeEmpty()) return typeof emptyMask !== 'undefined' ? emptyMask : ''; }
    if (fmtMask.match(/[Mdy]/g) !== null) { if (this.isDateEmpty()) return typeof emptyMask !== 'undefined' ? emptyMask : ''; }
    let formatted = typeof fmtMask !== 'undefined' && fmtMask !== null ? fmtMask : 'MM-dd-yyyy HH:mm:ss';
    let letters = 'dMyHhmst'.split('');
    let temp = [];
    let count = 0;
    let regexA;
    let regexB = /\[(\d+)\]/;
    let year = this.getFullYear().toString();
    let formats = {
        d: this.getDate().toString(),
        dd: this.getDate().toString().padStart(2, '00'),
        ddd: this.getDay() >= 0 ? formatType.DAYS[this.getDay()].substring(0, 3) : '',
        dddd: this.getDay() >= 0 ? formatType.DAYS[this.getDay()] : '',
        M: (this.getMonth() + 1).toString(),
        MM: (this.getMonth() + 1).toString().padStart(2, '00'),
        MMM: this.getMonth() >= 0 ? formatType.MONTHS[this.getMonth()].substring(0, 3) : '',
        MMMM: this.getMonth() >= 0 ? formatType.MONTHS[this.getMonth()] : '',
        y: year.charAt(2) === '0' ? year.charAt(4) : year.substring(2, 4),
        yy: year.substring(2, 4),
        yyyy: year,
        H: this.getHours().toString(),
        HH: this.getHours().toString().padStart(2, '00'),
        h: this.getHours() === 0 ? '12' : this.getHours() > 12 ? Math.abs(this.getHours() - 12).toString() : this.getHours().toString(),
        hh: this.getHours() === 0 ? '12' : this.getHours() > 12 ? Math.abs(this.getHours() - 12).toString().padStart(2, '00') : this.getHours().toString().padStart(2, '00'),
        m: this.getMinutes().toString(),
        mm: this.getMinutes().toString().padStart(2, '00'),
        s: this.getSeconds().toString(),
        ss: this.getSeconds().toString().padStart(2, '00'),
        t: this.getHours() < 12 || this.getHours() === 24 ? 'a' : 'p',
        tt: this.getHours() < 12 || this.getHours() === 24 ? 'am' : 'pm'
    };
    for (let i = 0; i < letters.length; i++) {
        regexA = new RegExp('(' + letters[i] + '+)');
        while (regexA.test(formatted)) {
            temp[count] = RegExp.$1;
            formatted = formatted.replace(RegExp.$1, '[' + count + ']');
            count++;
        }
    }
    while (regexB.test(formatted))
        formatted = formatted.replace(regexB, formats[temp[RegExp.$1]]);
    //console.log({ formatted: formatted, fmtMask: fmtMask });
    return formatted;
};
Number.prototype.round = function (dec) { return Number(Math.round(this + 'e' + dec) + 'e-' + dec); };
Number.prototype.fmt = function (format, empty) {
    if (isNaN(this)) return empty || '';
    if (typeof format === 'undefined') return this.toString();
    let isNegative = this < 0;
    let tok = ['#', '0'];
    let pfx = '', sfx = '', fmt = format.replace(/[^#\.0\,]/g, '');
    let dec = fmt.lastIndexOf('.') > 0 ? fmt.length - (fmt.lastIndexOf('.') + 1) : 0,
        fw = '', fd = '', vw = '', vd = '', rw = '', rd = '';
    let val = String(Math.abs(this).round(dec));
    let ret = '', commaChar = ',', decChar = '.';
    for (var i = 0; i < format.length; i++) {
        let c = format.charAt(i);
        if (c === '#' || c === '0' || c === '.' || c === ',')
            break;
        pfx += c;
    }
    for (let i = format.length - 1; i >= 0; i--) {
        let c = format.charAt(i);
        if (c === '#' || c === '0' || c === '.' || c === ',')
            break;
        sfx = c + sfx;
    }
    if (dec > 0) {
        let dp = val.lastIndexOf('.');
        if (dp === -1) {
            val += '.'; dp = 0;
        }
        else
            dp = val.length - (dp + 1);
        while (dp < dec) {
            val += '0';
            dp++;
        }
        fw = fmt.substring(0, fmt.lastIndexOf('.'));
        fd = fmt.substring(fmt.lastIndexOf('.') + 1);
        vw = val.substring(0, val.lastIndexOf('.'));
        vd = val.substring(val.lastIndexOf('.') + 1);
        let ds = val.substring(val.lastIndexOf('.'), val.length);
        for (let i = 0; i < fd.length; i++) {
            if (fd.charAt(i) === '#' && vd.charAt(i) !== '0') {
                rd += vd.charAt(i);
                continue;
            } else if (fd.charAt(i) === '#' && vd.charAt(i) === '0') {
                var np = vd.substring(i);
                if (np.match('[1-9]')) {
                    rd += vd.charAt(i);
                    continue;
                }
                else
                    break;
            }
            else if (fd.charAt(i) === '0' || fd.charAt(i) === '#')
                rd += vd.charAt(i);
        }
        if (rd.length > 0) rd = decChar + rd;
    }
    else {
        fw = fmt;
        vw = val;
    }
    var cg = fw.lastIndexOf(',') >= 0 ? fw.length - fw.lastIndexOf(',') - 1 : 0;
    var nw = Math.abs(Math.floor(this.round(dec)));
    if (!(nw === 0 && fw.substr(fw.length - 1) === '#') || fw.substr(fw.length - 1) === '0') {
        var gc = 0;
        for (let i = vw.length - 1; i >= 0; i--) {
            rw = vw.charAt(i) + rw;
            gc++;
            if (gc === cg && i !== 0) {
                rw = commaChar + rw;
                gc = 0;
            }
        }
        if (fw.length > rw.length) {
            var pstart = fw.indexOf('0');
            if (pstart >= 0) {
                var plen = fw.length - pstart;
                var pos = fw.length - rw.length - 1;
                while (rw.length < plen) {
                    let pc = fw.charAt(pos);
                    if (pc === ',') pc = commaChar;
                    rw = pc + rw;
                    pos--;
                }
            }
        }
    }
    if (isNegative) rw = '-' + rw;
    if (rd.length === 0 && rw.length === 0) return '';
    return pfx + rw + rd + sfx;
};
var baseUrl = window.location.protocol === 'file:' ? 'http://ESPSomfyRTS' : '';
//var baseUrl = '';
function makeBool(val) {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'undefined') return false;
    if (typeof val === 'number') return val >= 1;
    if (typeof val === 'string') {
        if (val === '') return false;
        switch (val.toLowerCase().trim()) {
            case 'on':
            case 'true':
            case 'yes':
            case 'y':
                return true;
            case 'off':
            case 'false':
            case 'no':
            case 'n':
                return false;
        }
        if (!isNaN(parseInt(val, 10))) return parseInt(val, 10) >= 1;
    }
    return false;
}
var httpStatusText = {
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Unused',
    '307': 'Temporary Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Required',
    '413': 'Request Entry Too Large',
    '414': 'Request-URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Requested Range Not Satisfiable',
    '417': 'Expectation Failed',
    '418': 'I\'m a teapot',
    '429': 'Too Many Requests',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported'
};
function getJSON(url, cb) {
    let xhr = new XMLHttpRequest();
    console.log({ get: url });
    xhr.open('GET', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
    xhr.setRequestHeader('apikey', security.apiKey);
    xhr.responseType = 'json';
    xhr.onload = () => {
        let status = xhr.status;
        if (status !== 200) {
            let err = xhr.response || {};
            err.htmlError = status;
            err.service = `GET ${url}`;
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(xhr.response, null);
        }
        else {
            cb(null, xhr.response);
        }
    };
    xhr.onerror = (evt) => {
        let err = {
            htmlError: xhr.status || 500,
            service: `GET ${url}`
        };
        if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
        cb(err, null);
    };
    xhr.send();
}
function getJSONSync(url, cb) {
    let overlay = ui.waitMessage(document.getElementById('divContainer'));
    let xhr = new XMLHttpRequest();
    console.log({ get: url });
    xhr.responseType = 'json';
    xhr.onload = () => {
        let status = xhr.status;
        if (status !== 200) {
            let err = xhr.response || {};
            err.htmlError = status;
            err.service = `GET ${url}`;
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(xhr.response, null);
        }
        else {
            cb(null, xhr.response);
        }
        if (typeof overlay !== 'undefined') overlay.remove();
    };
    xhr.onerror = (evt) => {
        let err = {
            htmlError: xhr.status || 500,
            service: `GET ${url}`
        };
        if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
        cb(err, null);
        if (typeof overlay !== 'undefined') overlay.remove();
    };
    xhr.onabort = (evt) => {
        console.log('Aborted');
        if (typeof overlay !== 'undefined') overlay.remove();
    };
    xhr.open('GET', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
    xhr.setRequestHeader('apikey', security.apiKey);
    xhr.send();
}
function getText(url, cb) {
    let xhr = new XMLHttpRequest();
    console.log({ get: url });
    xhr.open('GET', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
    xhr.setRequestHeader('apikey', security.apiKey);
    xhr.responseType = 'text';
    xhr.onload = () => {
        let status = xhr.status;
        if (status !== 200) {
            let err = xhr.response || {};
            err.htmlError = status;
            err.service = `GET ${url}`;
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(err, null);
        }
        else
            cb(null, xhr.response);
    };
    xhr.onerror = (evt) => {
        let err = {
            htmlError: xhr.status || 500,
            service: `GET ${url}`
        };
        if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
        cb(err, null);
    };
    xhr.send();
}
function postJSONSync(url, data, cb) {
    let overlay = ui.waitMessage(document.getElementById('divContainer'));
    try {
        let xhr = new XMLHttpRequest();
        console.log({ post: url, data: data });
        let fd = new FormData();
        for (let name in data) {
            fd.append(name, data[name]);
        }
        xhr.open('POST', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('apikey', security.apiKey);
        xhr.onload = () => {
            let status = xhr.status;
            console.log(xhr);
            if (status !== 200) {
                let err = xhr.response || {};
                err.htmlError = status;
                err.service = `POST ${url}`;
                err.data = data;
                if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
                cb(err, null);
            }
            else {
                cb(null, xhr.response);
            }
            overlay.remove();
        };
        xhr.onerror = (evt) => {
            console.log(xhr);
            let err = {
                htmlError: xhr.status || 500,
                service: `POST ${url}`
            };
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(err, null);
            overlay.remove();
        };
        xhr.send(fd);
    } catch (err) { ui.serviceError(document.getElementById('divContainer'), err); }
}
function putJSON(url, data, cb) {
    let xhr = new XMLHttpRequest();
    console.log({ put: url, data: data });
    xhr.open('PUT', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('apikey', security.apiKey);
    xhr.onload = () => {
        let status = xhr.status;
        if (status !== 200) {
            let err = xhr.response || {};
            err.htmlError = status;
            err.service = `PUT ${url}`;
            err.data = data;
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(err, null);
        }
        else {
            cb(null, xhr.response);
        }
    };
    xhr.onerror = (evt) => {
        console.log(xhr);
        let err = {
            htmlError: xhr.status || 500,
            service: `PUT ${url}`
        };
        if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
        cb(err, null);
    };
    xhr.send(JSON.stringify(data));
}
function putJSONSync(url, data, cb) {
    let overlay = ui.waitMessage(document.getElementById('divContainer'));
    try {
        let xhr = new XMLHttpRequest();
        console.log({ put: url, data: data });
        //xhr.open('PUT', url, true);
        xhr.open('PUT', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('apikey', security.apiKey);
        xhr.onload = () => {
            let status = xhr.status;
            if (status !== 200) {
                let err = xhr.response || {};
                err.htmlError = status;
                err.service = `PUT ${url}`;
                err.data = data;
                if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
                cb(err, null);
            }
            else {
                cb(null, xhr.response);
            }
            overlay.remove();
        };
        xhr.onerror = (evt) => {
            console.log(xhr);
            let err = {
                htmlError: xhr.status || 500,
                service: `PUT ${url}`
            };
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(err, null);
            overlay.remove();
        };
        xhr.send(JSON.stringify(data));
    } catch (err) { ui.serviceError(document.getElementById('divContainer'), err); }
}
var socket;
var tConnect = null;
var sockIsOpen = false;
var connecting = false;
var connects = 0;
var connectFailed = 0;
async function initSockets() {
    if (connecting) return;
    console.log('Connecting to socket...');
    connecting = true;
    if (tConnect) clearTimeout(tConnect);
    tConnect = null;
    let wms = document.getElementsByClassName('socket-wait');
    for (let i = 0; i < wms.length; i++) {
        wms[i].remove();
    }
    ui.waitMessage(document.getElementById('divContainer')).classList.add('socket-wait');
    let host = window.location.protocol === 'file:' ? 'ESPSomfyRTS' : window.location.hostname;
    try {
        socket = new WebSocket(`ws://${host}:8080/`);
        socket.onmessage = (evt) => {
            if (evt.data.startsWith('42')) {
                let ndx = evt.data.indexOf(',');
                let eventName = evt.data.substring(3, ndx);
                let data = evt.data.substring(ndx + 1, evt.data.length - 1);
                try {
                    var reISO = /^(\d{4}|\+010000)-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
                    var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
                    var msg = JSON.parse(data, (key, value) => {
                        if (typeof value === 'string') {
                            var a = reISO.exec(value);
                            if (a) return new Date(value);
                            a = reMsAjax.exec(value);
                            if (a) {
                                var b = a[1].split(/[-+,.]/);
                                return new Date(b[0] ? +b[0] : 0 - +b[1]);
                            }
                        }
                        return value;
                    });
                    switch (eventName) {
                        case 'remoteFrame':
                            somfy.procRemoteFrame(msg);
                            break;
                        case 'groupState':
                            somfy.procGroupState(msg);
                            break;
                        case 'shadeState':
                            somfy.procShadeState(msg);
                            break;
                        case 'shadeCommand':
                            console.log(msg);
                            break;
                        case 'shadeRemoved':
                            break;
                        case 'shadeAdded':
                            break;
                        case 'ethernet':
                            wifi.procEthernet(msg);
                            break;
                        case 'wifiStrength':
                            wifi.procWifiStrength(msg);
                            break;
                        case 'packetPulses':
                            console.log(msg);
                            break;

                    }
                } catch (err) {
                    console.log({ eventName: eventName, data: data, err: err });
                }
            }
        };
        socket.onopen = (evt) => {
            if (tConnect) clearTimeout(tConnect);
            tConnect = null;
            console.log({ msg: 'open', evt: evt });
            sockIsOpen = true;
            connecting = false;
            connects++;
            connectFailed = 0;
            let wms = document.getElementsByClassName('socket-wait');
            for (let i = 0; i < wms.length; i++) {
                wms[i].remove();
            }
            let errs = document.getElementsByClassName('socket-error');
            for (let i = 0; i < errs.length; i++)
                errs[i].remove();
            if (general.reloadApp) {
                general.reload();
            }
            else {
                (async () => {
                    await general.loadGeneral();
                    await wifi.loadNetwork();
                    await somfy.loadSomfy();
                    await mqtt.loadMQTT();
                    //await general.init();
                    //await somfy.init();
                    //await mqtt.init();
                    //await wifi.init();
                })();
            }
        };
        socket.onclose = (evt) => {
            wifi.procWifiStrength({ ssid: '', channel: -1, strength: -100 });
            wifi.procEthernet({ connected: '', speed: 0, fullduplex: false });
            if (document.getElementsByClassName('socket-wait').length === 0)
                ui.waitMessage(document.getElementById('divContainer')).classList.add('socket-wait');
            if (evt.wasClean) {
                console.log({ msg: 'close-clean', evt: evt });
                connectFailed = 0;
                tConnect = setTimeout(async () => { await reopenSocket(); }, 7000);
                console.log('Reconnecting socket in 7 seconds');
            }
            else {
                console.log({ msg: 'close-died', reason: evt.reason, evt: evt, sock: socket });
                if (connects > 0) {
                    console.log('Reconnecting socket in 3 seconds');
                    tConnect = setTimeout(async () => { await reopenSocket(); }, 3000);
                }
                else {
                    if (connecting) {
                        connectFailed++;
                        let timeout = Math.min(connectFailed * 500, 10000);
                        console.log(`Initial socket did not connect try again (server was busy and timed out ${connectFailed} times)`);
                        tConnect = setTimeout(async () => { await reopenSocket(); }, timeout);
                        if (connectFailed === 5) {
                            ui.socketError('Too many clients connected.  A maximum of 5 clients may be connected at any one time.  Close some connections to the ESP Somfy RTS device to proceed.');
                        }
                        let spanAttempts = document.getElementById('spanSocketAttempts');
                        if (spanAttempts) spanAttempts.innerHTML = connectFailed.fmt("#,##0");

                    }
                    else {
                        console.log('Connecting socket in .5 seconds');
                        tConnect = setTimeout(async () => { await reopenSocket(); }, 500);
                    }

                }

            }
            connecting = false;
        };
        socket.onerror = (evt) => {
            console.log({ msg: 'socket error', evt: evt, sock: socket });
        };
    } catch (err) {
        console.log({
            msg: 'Websocket connection error', err: err
        });
        tConnect = setTimeout(async () => { await reopenSocket(); }, 5000);
    }
}
async function reopenSocket() {
    if (tConnect) clearTimeout(tConnect);
    tConnect = null;
    await initSockets();
}
async function init() {
    await security.init();
    general.init();
    wifi.init();
    somfy.init();
    mqtt.init();
    firmware.init();
}
class UIBinder {
    setValue(el, val) {
        if (el instanceof HTMLInputElement) {
            switch (el.type.toLowerCase()) {
                case 'checkbox':
                    el.checked = makeBool(val);
                    break;
                case 'range':
                    let dt = el.getAttribute('data-datatype');
                    let mult = parseInt(el.getAttribute('data-mult') || 1, 10);
                    switch (dt) {
                        // We always range with integers
                        case 'float':
                            el.value = Math.round(parseInt(val * mult, 10));
                            break;
                        case 'index':
                            let ivals = JSON.parse(el.getAttribute('data-values'));
                            for (let i = 0; i < ivals.length; i++) {
                                if (ivals[i].toString() === val.toString()) {
                                    el.value = i;
                                    break;
                                }
                            }
                            break;
                        default:
                            el.value = parseInt(val, 10) * mult;
                            break;
                    }
                    break;
                default:
                    el.value = val;
                    break;
            }
        }
        else if (el instanceof HTMLSelectElement) {
            let ndx = 0;
            for (let i = 0; i < el.options.length; i++) {
                let opt = el.options[i];
                if (opt.value === val.toString()) {
                    ndx = i;
                    break;
                }
            }
            el.selectedIndex = ndx;
        }
        else if (el instanceof HTMLElement) el.innerHTML = val;
    }
    getValue(el, defVal) {
        let val = defVal;
        if (el instanceof HTMLInputElement) {
            switch (el.type.toLowerCase()) {
                case 'checkbox':
                    val = el.checked;
                    break;
                case 'range':
                    let dt = el.getAttribute('data-datatype');
                    let mult = parseInt(el.getAttribute('data-mult') || 1, 10);
                    switch (dt) {
                        // We always range with integers
                        case 'float':
                            val = parseInt(el.value, 10) / mult;
                            break;
                        case 'index':
                            let ivals = JSON.parse(el.getAttribute('data-values'));
                            val = ivals[parseInt(el.value, 10)];
                            break;
                        default:
                            val = parseInt(el.value / mult, 10);
                            break;
                    }
                    break;
                default:
                    val = el.value;
                    break;
            }
        }
        else if (el instanceof HTMLSelectElement) val = el.value;
        else if (el instanceof HTMLElement) val = el.innerHTML;
        return val;
    }
    toElement(el, val) {
        let flds = el.querySelectorAll('*[data-bind]');
        flds.forEach((fld) => {
            let prop = fld.getAttribute('data-bind');
            let arr = prop.split('.');
            let tval = val;
            for (let i = 0; i < arr.length; i++) {
                var s = arr[i];
                if (typeof s === 'undefined' || !s) continue;
                let ndx = s.indexOf('[');
                if (ndx !== -1) {
                    ndx = parseInt(s.substring(ndx + 1, s.indexOf(']') - 1), 10);
                    s = s.substring(0, ndx - 1);
                }
                tval = tval[s];
                if (typeof tval === 'undefined') break;
                if (ndx >= 0) tval = tval[ndx];
            }
            if (typeof tval !== 'undefined') {
                if (typeof fld.val === 'function') this.val(tval);
                else {
                    switch (fld.getAttribute('data-fmttype')) {
                        case 'time':
                            {
                                var dt = new Date();
                                dt.setHours(0, 0, 0);
                                dt.addMinutes(tval);
                                tval = dt.fmt(fld.getAttribute('data-fmtmask'), fld.getAttribute('data-fmtempty') || '');
                            }
                            break;
                        case 'date':
                        case 'datetime':
                            {
                                let dt = new Date(tval);
                                tval = dt.fmt(fld.getAttribute('data-fmtmask'), fld.getAttribute('data-fmtempty') || '');
                            }
                            break;
                        case 'number':
                            if (typeof tval !== 'number') tval = parseFloat(tval);
                            tval = tval.fmt(fld.getAttribute('data-fmtmask'), fld.getAttribute('data-fmtempty') || '');
                            break;
                        case 'duration':
                            tval = dataBinder.formatDuration(tval, $this.attr('data-fmtmask'));
                            break;
                    }
                    this.setValue(fld, tval);
                }
            }
        });
    }
    fromElement(el, obj, arrayRef) {
        if (typeof arrayRef === 'undefined' || arrayRef === null) arrayRef = [];
        if (typeof obj === 'undefined' || obj === null) obj = {};
        if (typeof el.getAttribute('data-bind') !== 'undefined') this._bindValue(obj, el, this.getValue(el), arrayRef);
        let flds = el.querySelectorAll('*[data-bind]');
        flds.forEach((fld) => {
            if (!makeBool(fld.getAttribute('data-setonly')))
                this._bindValue(obj, fld, this.getValue(fld), arrayRef);
        });
        return obj;
    }
    parseNumber(val) {
        if (val === null) return;
        if (typeof val === 'undefined') return val;
        if (typeof val === 'number') return val;
        if (typeof val.getMonth === 'function') return val.getTime();
        var tval = val.replace(/[^0-9\.\-]+/g, '');
        return tval.indexOf('.') !== -1 ? parseFloat(tval) : parseInt(tval, 10);
    }
    _bindValue(obj, el, val, arrayRef) {
        var binding = el.getAttribute('data-bind');
        var dataType = el.getAttribute('data-datatype');
        if (binding && binding.length > 0) {
            var sRef = '';
            var arr = binding.split('.');
            var t = obj;
            for (var i = 0; i < arr.length - 1; i++) {
                let s = arr[i];
                if (typeof s === 'undefined' || s.length === 0) continue;
                sRef += '.' + s;
                var ndx = s.lastIndexOf('[');
                if (ndx !== -1) {
                    var v = s.substring(0, ndx);
                    var ndxEnd = s.lastIndexOf(']');
                    var ord = parseInt(s.substring(ndx + 1, ndxEnd), 10);
                    if (isNaN(ord)) ord = 0;
                    if (typeof arrayRef[sRef] === 'undefined') {
                        if (typeof t[v] === 'undefined') {
                            t[v] = new Array();
                            t[v].push(new Object());
                            t = t[v][0];
                            arrayRef[sRef] = ord;
                        }
                        else {
                            k = arrayRef[sRef];
                            if (typeof k === 'undefined') {
                                a = t[v];
                                k = a.length;
                                arrayRef[sRef] = k;
                                a.push(new Object());
                                t = a[k];
                            }
                            else
                                t = t[v][k];
                        }
                    }
                    else {
                        k = arrayRef[sRef];
                        if (typeof k === 'undefined') {
                            a = t[v];
                            k = a.length;
                            arrayRef[sRef] = k;
                            a.push(new Object());
                            t = a[k];
                        }
                        else
                            t = t[v][k];
                    }
                }
                else if (typeof t[s] === 'undefined') {
                    t[s] = new Object();
                    t = t[s];
                }
                else
                    t = t[s];
            }
            if (typeof dataType === 'undefined') dataType = 'string';
            t[arr[arr.length - 1]] = this.parseValue(val, dataType);
        }
    }
    parseValue(val, dataType) {
        switch (dataType) {
            case 'int':
                return Math.floor(this.parseNumber(val));
            case 'uint':
                return Math.abs(this.parseNumber(val));
            case 'float':
            case 'real':
            case 'double':
            case 'decimal':
            case 'number':
                return this.parseNumber(val);
            case 'date':
                if (typeof val === 'string') return Date.parseISO(val);
                else if (typeof val === 'number') return new Date(number);
                else if (typeof val.getMonth === 'function') return val;
                return undefined;
            case 'time':
                var dt = new Date();
                if (typeof val === 'number') {
                    dt.setHours(0, 0, 0);
                    dt.addMinutes(tval);
                    return dt;
                }
                else if (typeof val === 'string' && val.indexOf(':') !== -1) {
                    var n = val.lastIndexOf(':');
                    var min = this.parseNumber(val.substring(n));
                    var nsp = val.substring(0, n).lastIndexOf(' ') + 1;
                    var hrs = this.parseNumber(val.substring(nsp, n));
                    dt.setHours(0, 0, 0);
                    if (hrs <= 12 && val.substring(n).indexOf('p')) hrs += 12;
                    dt.addMinutes(hrs * 60 + min);
                    return dt;
                }
                break;
            case 'duration':
                if (typeof val === 'number') return val;
                return Math.floor(this.parseNumber(val));
            default:
                return val;
        }
    }
    formatValue(val, dataType, fmtMask, emptyMask) {
        var v = this.parseValue(val, dataType);
        if (typeof v === 'undefined') return emptyMask || '';
        switch (dataType) {
            case 'int':
            case 'uint':
            case 'float':
            case 'real':
            case 'double':
            case 'decimal':
            case 'number':
                return v.fmt(fmtMask, emptyMask || '');
            case 'time':
            case 'date':
            case 'dateTime':
                return v.fmt(fmtMask, emptyMask || '');
        }
        return v;
    }
    waitMessage(el) {
        let div = document.createElement('div');
        div.innerHTML = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
        div.classList.add('wait-overlay');
        if (typeof el === 'undefined') el = document.getElementById('divContainer');
        el.appendChild(div);
        return div;
    }
    serviceError(el, err) {
        if (arguments.length === 1) {
            err = el;
            el = document.getElementById('divContainer');
        }
        let msg = '';
        if (typeof err === 'string' && err.startsWith('{')) {
            let e = JSON.parse(err);
            if (typeof e !== 'undefined' && typeof e.desc === 'string') msg = e.desc;
            else msg = err;
        }
        else if (typeof err === 'string') msg = err;
        else if (typeof err === 'number') {
            switch (err) {
                case 404:
                    msg = `404: Service not found`;
                    break;
                default:
                    msg = `${err}: Service Error`;
                    break;
            }
        }
        else if (typeof err !== 'undefined') {
            if (typeof err.desc === 'string') msg = typeof err.desc !== 'undefined' ? err.desc : err.message;
        }
        console.log(err);
        let div = this.errorMessage(`${err.htmlError || 500}:Service Error`);
        let sub = div.querySelector('.sub-message');
        sub.innerHTML = `<div><label>Service:</label>${err.service}</div><div style="font-size:22px;">${msg}</div>`;
        return div;
    }
    socketError(el, msg) {
        if (arguments.length === 1) {
            msg = el;
            el = document.getElementById('divContainer');
        }
        let div = document.createElement('div');
        div.innerHTML = '<div id="divSocketAttempts" style="position:absolute;width:100%;left:0px;padding-right:24px;text-align:right;top:0px;font-size:18px;"><span>Attempts: </span><span id="spanSocketAttempts"></span></div><div class="inner-error"><div>Could not connect to server</div><hr></hr><div style="font-size:.7em">' + msg + '</div></div>';
        div.classList.add('error-message');
        div.classList.add('socket-error');
        div.classList.add('message-overlay');
        el.appendChild(div);
        return div;
    }
    errorMessage(el, msg) {
        if (arguments.length === 1) {
            msg = el;
            el = document.getElementById('divContainer');
        }
        let div = document.createElement('div');
        div.innerHTML = '<div class="inner-error">' + msg + '</div><div class="sub-message"></div><button type="button" onclick="ui.clearErrors();">Close</button></div>';
        div.classList.add('error-message');
        div.classList.add('message-overlay');
        el.appendChild(div);
        return div;
    }
    promptMessage(el, msg, onYes) {
        if (arguments.length === 2) {
            onYes = msg;
            msg = el;
            el = document.getElementById('divContainer');
        }
        let div = document.createElement('div');
        div.innerHTML = '<div class="prompt-text">' + msg + '</div><div class="sub-message"></div><div class="button-container"><button id="btnYes" type="button">Yes</button><button type="button" onclick="ui.clearErrors();">No</button></div></div>';
        div.classList.add('prompt-message');
        div.classList.add('message-overlay');
        el.appendChild(div);
        div.querySelector('#btnYes').addEventListener('click', onYes);
        return div;
    }
    clearErrors() {
        let errors = document.querySelectorAll('div.message-overlay');
        if (errors && errors.length > 0) errors.forEach((el) => { el.remove(); });
    }
    selectTab(elTab) {
        for (let tab of elTab.parentElement.children) {
            if (tab.classList.contains('selected')) tab.classList.remove('selected');
            document.getElementById(tab.getAttribute('data-grpid')).style.display = 'none';
        }
        if (!elTab.classList.contains('selected')) elTab.classList.add('selected');
        document.getElementById(elTab.getAttribute('data-grpid')).style.display = '';
    }
    wizSetPrevStep(el) { this.wizSetStep(el, Math.max(this.wizCurrentStep(el) - 1, 1)); }
    wizSetNextStep(el) { this.wizSetStep(el, this.wizCurrentStep(el) + 1); }
    wizSetStep(el, step) {
        let curr = this.wizCurrentStep(el);
        let max = parseInt(el.getAttribute('data-maxsteps'), 10);
        if (!isNaN(max)) {
            let next = el.querySelector(`#btnNextStep`);
            if (next) next.style.display = max < step ? 'inline-block' : 'none';
        }
        let prev = el.querySelector(`#btnPrevStep`);
        if (prev) prev.style.display = step <= 1 ? 'none' : 'inline-block';
        if (curr !== step) {
            el.setAttribute('data-stepid', step);
            let evt = new CustomEvent('stepchanged', { detail: { oldStep: curr, newStep: step }, bubbles: true, cancelable: true, composed: false });
            el.dispatchEvent(evt);
        }
    }
    wizCurrentStep(el) { return parseInt(el.getAttribute('data-stepid') || 1, 10); }
    pinKeyPressed(evt) {
        let parent = evt.srcElement.parentElement;
        let digits = parent.querySelectorAll('.pin-digit');
        switch (evt.key) {
            case 'Backspace':
                setTimeout(() => {
                    // Focus to the previous element.
                    for (let i = 0; i < digits.length; i++) {
                        if (digits[i] === evt.srcElement && i > 0) {
                            digits[i - 1].focus();
                            break;
                        }
                    }
                }, 0);
                return;
            case 'ArrowLeft':
                setTimeout(() => {
                    for (let i = 0; i < digits.length; i++) {
                        if (digits[i] === evt.srcElement && i > 0) {
                            digits[i - 1].focus();
                        }
                    }
                });
                return;
            case 'CapsLock':
            case 'Control':
            case 'Shift':
            case 'Enter':
            case 'Tab':
                return;
            case 'ArrowRight':
                if (evt.srcElement.value !== '') {
                    setTimeout(() => {
                        for (let i = 0; i < digits.length; i++) {
                            if (digits[i] === evt.srcElement && i < digits.length - 1) {
                                digits[i + 1].focus();
                            }
                        }
                    });
                }
                return;
            default:
                if (evt.srcElement.value !== '') evt.srcElement.value = '';
                setTimeout(() => {
                    let e = new CustomEvent('digitentered', { detail: {}, bubbles: true, cancelable: true, composed: false });
                    evt.srcElement.dispatchEvent(e);
                }, 100);
                break;
        }
        setTimeout(() => {
            // Focus to the first empty element.
            for (let i = 0; i < digits.length; i++) {
                if (digits[i].value === '') {
                    if (digits[i] !== evt.srcElement) digits[i].focus();
                    break;
                }
            }
        }, 0);

    }
    pinDigitFocus(evt) {
        // Find the first empty digit and place the cursor there.
        if (evt.srcElement.value !== '') return;
        let parent = evt.srcElement.parentElement;
        let digits = parent.querySelectorAll('.pin-digit');
        for (let i = 0; i < digits.length; i++) {
            if (digits[i].value === '') {
                if (digits[i] !== evt.srcElement) digits[i].focus();
                break;
            }
        }
    }
    isConfigOpen() { return window.getComputedStyle(document.getElementById('divConfigPnl')).display !== 'none'; }
    setConfigPanel() {
        if (this.isConfigOpen()) return;
        let divCfg = document.getElementById('divConfigPnl');
        let divHome = document.getElementById('divHomePnl');
        divHome.style.display = 'none';
        divCfg.style.display = '';
        document.getElementById('icoConfig').className = 'icss-home';
        if (sockIsOpen) socket.send('join:0');
        let overlay = ui.waitMessage(document.getElementById('divSecurityOptions'));
        overlay.style.borderRadius = '5px';
        getJSON('/getSecurity', (err, security) => {
            overlay.remove();
            if (err) ui.serviceError(err);
            else {
                console.log(security);
                general.setSecurityConfig(security);
            }
        });
    }
    setHomePanel() {
        if (!this.isConfigOpen()) return;
        let divCfg = document.getElementById('divConfigPnl');
        let divHome = document.getElementById('divHomePnl');
        divHome.style.display = '';
        divCfg.style.display = 'none';
        document.getElementById('icoConfig').className = 'icss-gear';
        if (sockIsOpen) socket.send('leave:0');
        general.setSecurityConfig({ type: 0, username: '', password: '', pin: '', permissions: 0 });
    }
    toggleConfig() {
        if (this.isConfigOpen())
            this.setHomePanel();
        else {
            if (!security.authenticated && security.type !== 0) {
                document.getElementById('divContainer').addEventListener('afterlogin', (evt) => {
                    if (security.authenticated) this.setConfigPanel();
                }, { once: true });
                security.authUser();
            }
            else this.setConfigPanel();
        }
        somfy.showEditShade(false);
        somfy.showEditGroup(false);
    }
}
var ui = new UIBinder();

class Security {
    type = 0;
    authenticated = false;
    apiKey = '';
    permissions = 0;
    async init() {
        let fld = document.getElementById('divUnauthenticated').querySelector('.pin-digit[data-bind="security.pin.d0"]');
        document.getElementById('divUnauthenticated').querySelector('.pin-digit[data-bind="login.pin.d3"]').addEventListener('digitentered', (evt) => {
            security.login();
        });
        await this.loadContext();
        if (this.type === 0 || (this.permissions & 0x01) === 0x01) { // No login required or only the config is protected.
            if (typeof socket === 'undefined' || !socket) (async () => { await initSockets(); })();
            //ui.setMode(mode);
            document.getElementById('divUnauthenticated').style.display = 'none';
            document.getElementById('divAuthenticated').style.display = '';
            document.getElementById('divContainer').setAttribute('data-auth', true);
        }
    }
    async loadContext() {
        let pnl = document.getElementById('divUnauthenticated');
        pnl.querySelector('#loginButtons').style.display = 'none';
        pnl.querySelector('#divLoginPassword').style.display = 'none';
        pnl.querySelector('#divLoginPin').style.display = 'none';
        await new Promise((resolve, reject) => {
            getJSONSync('/loginContext', (err, ctx) => {
                pnl.querySelector('#loginButtons').style.display = '';
                resolve();
                if (err) ui.serviceError(err);
                else {
                    console.log(ctx);
                    document.getElementById('divContainer').setAttribute('data-securitytype', ctx.type);
                    this.type = ctx.type;
                    this.permissions = ctx.permissions;
                    switch (ctx.type) {
                        case 1:
                            pnl.querySelector('#divLoginPin').style.display = '';
                            pnl.querySelector('#divLoginPassword').style.display = 'none';
                            pnl.querySelector('.pin-digit[data-bind="login.pin.d0"]').focus();
                            break;
                        case 2:
                            pnl.querySelector('#divLoginPassword').style.display = '';
                            pnl.querySelector('#divLoginPin').style.display = 'none';
                            pnl.querySelector('#fldLoginUsername').focus();
                            break;
                    }
                    pnl.querySelector('#fldLoginType').value = ctx.type;
                }
            });
        });
    }
    authUser() {
        document.getElementById('divAuthenticated').style.display = 'none';
        document.getElementById('divUnauthenticated').style.display = '';
        this.loadContext();
        document.getElementById('btnCancelLogin').style.display = 'inline-block';
    }
    cancelLogin() {
        let evt = new CustomEvent('afterlogin', { detail: { authenticated: this.authenticated } });
        document.getElementById('divAuthenticated').style.display = '';
        document.getElementById('divUnauthenticated').style.display = 'none';
        document.getElementById('divContainer').dispatchEvent(evt);
    }
    login() {
        console.log('Logging in...');
        let pnl = document.getElementById('divUnauthenticated');
        let msg = pnl.querySelector('#spanLoginMessage');
        msg.innerHTML = '';
        let sec = ui.fromElement(pnl).login;
        console.log(sec);
        let pin = '';
        switch (sec.type) {
            case 1:
                for (let i = 0; i < 4; i++) {
                    pin += sec.pin[`d${i}`];
                }
                if (pin.length !== 4) return;
                break;
            case 2:
                break;
        }
        sec.pin = pin;
        putJSONSync('/login', sec, (err, log) => {
            if (err) ui.serviceError(err);
            else {
                console.log(log);
                if (log.success) {
                    if (typeof socket === 'undefined' || !socket) (async () => { await initSockets(); })();
                    //ui.setMode(mode);

                    document.getElementById('divUnauthenticated').style.display = 'none';
                    document.getElementById('divAuthenticated').style.display = '';
                    document.getElementById('divContainer').setAttribute('data-auth', true);
                    this.apiKey = log.apiKey;
                    this.authenticated = true;
                    let evt = new CustomEvent('afterlogin', { detail: { authenticated: true } });
                    document.getElementById('divContainer').dispatchEvent(evt);
                }
                else
                    msg.innerHTML = log.msg;
            }
        });
    }
}
var security = new Security();

class General {
    initialized = false;
    appVersion = 'v2.1.1';
    reloadApp = false;
    init() {
        if (this.initialized) return;
        this.setAppVersion();
        this.setTimeZones();
        if (sockIsOpen && ui.isConfigOpen()) socket.send('join:0');
        ui.toElement(document.getElementById('divSystemSettings'), { general: { hostname: 'ESPSomfyRTS', username: '', password: '', posixZone: 'UTC0', ntpServer: 'pool.ntp.org' } });
        this.initialized = true;
    }
    getCookie(cname) {
        let n = cname + '=';
        let cookies = document.cookie.split(';');
        console.log(cookies);
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i];
            while (c.charAt(0) === ' ') c = c.substring(0);
            if (c.indexOf(n) === 0) return c.substring(n.length, c.length);
        }
        return '';
    }
    reload() {
        let addMetaTag = (name, content) => {
            let meta = document.createElement('meta');
            meta.httpEquiv = name;
            meta.content = content;
            document.getElementsByTagName('head')[0].appendChild(meta);
        };
        addMetaTag('pragma', 'no-cache');
        addMetaTag('expires', '0');
        addMetaTag('cache-control', 'no-cache');
        document.location.reload();
    }
    timeZones = [
    { city: 'Africa/Cairo', code: 'EET-2' },
    { city: 'Africa/Johannesburg', code: 'SAST-2' },
    { city: 'Africa/Juba', code: 'CAT-2' },
    { city: 'Africa/Lagos', code: 'WAT-1' },
    { city: 'Africa/Mogadishu', code: 'EAT-3' },
    { city: 'Africa/Tunis', code: 'CET-1' },
    { city: 'America/Adak', code: 'HST10HDT,M3.2.0,M11.1.0' },
    { city: 'America/Anchorage', code: 'AKST9AKDT,M3.2.0,M11.1.0' },
    { city: 'America/Asuncion', code: '<-04>4<-03>,M10.1.0/0,M3.4.0/0' },
    { city: 'America/Bahia_Banderas', code: 'CST6CDT,M4.1.0,M10.5.0' },
    { city: 'America/Barbados', code: 'AST4' },
    { city: 'America/Bermuda', code: 'AST4ADT,M3.2.0,M11.1.0' },
    { city: 'America/Cancun', code: 'EST5' },
    { city: 'America/Central_Time', code: 'CST6CDT,M3.2.0,M11.1.0' },
    { city: 'America/Chihuahua', code: 'MST7MDT,M4.1.0,M10.5.0' },
    { city: 'America/Eastern_Time', code: 'EST5EDT,M3.2.0,M11.1.0' },
    { city: 'America/Godthab', code: '<-03>3<-02>,M3.5.0/-2,M10.5.0/-1' },
    { city: 'America/Havana', code: 'CST5CDT,M3.2.0/0,M11.1.0/1' },
    { city: 'America/Mexico_City', code: 'CST6' },
    { city: 'America/Miquelon', code: '<-03>3<-02>,M3.2.0,M11.1.0' },
    { city: 'America/Mountain_Time', code: 'MST7MDT,M3.2.0,M11.1.0' },
    { city: 'America/Pacific_Time', code: 'PST8PDT,M3.2.0,M11.1.0' },
    { city: 'America/Phoenix', code: 'MST7' },
    { city: 'America/Santiago', code: '<-04>4<-03>,M9.1.6/24,M4.1.6/24' },
    { city: 'America/St_Johns', code: 'NST3:30NDT,M3.2.0,M11.1.0' },
    { city: 'Antarctica/Troll', code: '<+00>0<+02>-2,M3.5.0/1,M10.5.0/3' },
    { city: 'Asia/Amman', code: 'EET-2EEST,M2.5.4/24,M10.5.5/1' },
    { city: 'Asia/Beirut', code: 'EET-2EEST,M3.5.0/0,M10.5.0/0' },
    { city: 'Asia/Colombo', code: '<+0530>-5:30' },
    { city: 'Asia/Damascus', code: 'EET-2EEST,M3.5.5/0,M10.5.5/0' },
    { city: 'Asia/Gaza', code: 'EET-2EEST,M3.4.4/50,M10.4.4/50' },
    { city: 'Asia/Hong_Kong', code: 'HKT-8' },
    { city: 'Asia/Jakarta', code: 'WIB-7' },
    { city: 'Asia/Jayapura', code: 'WIT-9' },
    { city: 'Asia/Jerusalem', code: 'IST-2IDT,M3.4.4/26,M10.5.0' },
    { city: 'Asia/Kabul', code: '<+0430>-4:30' },
    { city: 'Asia/Karachi', code: 'PKT-5' },
    { city: 'Asia/Kathmandu', code: '<+0545>-5:45' },
    { city: 'Asia/Kolkata', code: 'IST-5:30' },
    { city: 'Asia/Makassar', code: 'WITA-8' },
    { city: 'Asia/Manila', code: 'PST-8' },
    { city: 'Asia/Seoul', code: 'KST-9' },
    { city: 'Asia/Shanghai', code: 'CST-8' },
    { city: 'Asia/Tehran', code: '<+0330>-3:30' },
    { city: 'Asia/Tokyo', code: 'JST-9' },
    { city: 'Atlantic/Azores', code: '<-01>1<+00>,M3.5.0/0,M10.5.0/1' },
    { city: 'Australia/Adelaide', code: 'ACST-9:30ACDT,M10.1.0,M4.1.0/3' },
    { city: 'Australia/Brisbane', code: 'AEST-10' },
    { city: 'Australia/Darwin', code: 'ACST-9:30' },
    { city: 'Australia/Eucla', code: '<+0845>-8:45' },
    { city: 'Australia/Lord_Howe', code: '<+1030>-10:30<+11>-11,M10.1.0,M4.1.0' },
    { city: 'Australia/Melbourne', code: 'AEST-10AEDT,M10.1.0,M4.1.0/3' },
    { city: 'Australia/Perth', code: 'AWST-8' },
    { city: 'Etc/GMT-1', code: '<+01>-1' },
    { city: 'Etc/GMT-2', code: '<+02>-2' },
    { city: 'Etc/GMT-3', code: '<+03>-3' },
    { city: 'Etc/GMT-4', code: '<+04>-4' },
    { city: 'Etc/GMT-5', code: '<+05>-5' },
    { city: 'Etc/GMT-6', code: '<+06>-6' },
    { city: 'Etc/GMT-7', code: '<+07>-7' },
    { city: 'Etc/GMT-8', code: '<+08>-8' },
    { city: 'Etc/GMT-9', code: '<+09>-9' },
    { city: 'Etc/GMT-10',code: '<+10>-10' },
    { city: 'Etc/GMT-11', code: '<+11>-11' },
    { city: 'Etc/GMT-12', code: '<+12>-12' },
    { city: 'Etc/GMT-13', code: '<+13>-13' },
    { city: 'Etc/GMT-14', code: '<+14>-14' },
    { city: 'Etc/GMT+0', code: 'GMT0' },
    { city: 'Etc/GMT+1', code: '<-01>1' },
    { city: 'Etc/GMT+2', code: '<-02>2' },
    { city: 'Etc/GMT+3', code: '<-03>3' },
    { city: 'Etc/GMT+4', code: '<-04>4' },
    { city: 'Etc/GMT+5', code: '<-05>5' },
    { city: 'Etc/GMT+6', code: '<-06>6' },
    { city: 'Etc/GMT+7', code: '<-07>7' },
    { city: 'Etc/GMT+8', code: '<-08>8' },
    { city: 'Etc/GMT+9', code: '<-09>9' },
    { city: 'Etc/GMT+10', code: '<-10>10' },
    { city: 'Etc/GMT+11', code: '<-11>11' },
    { city: 'Etc/GMT+12', code: '<-12>12' },
    { city: 'Etc/UTC', code: 'UTC0' },
    { city: 'Europe/Athens', code: 'EET-2EEST,M3.5.0/3,M10.5.0/4' },
    { city: "Europe/Berlin", code: "CEST-1CET,M3.2.0/2:00:00,M11.1.0/2:00:00" },
    { city: 'Europe/Brussels', code: 'CET-1CEST,M3.5.0,M10.5.0/3' },
    { city: 'Europe/Chisinau', code: 'EET-2EEST,M3.5.0,M10.5.0/3' },
    { city: 'Europe/Dublin', code: 'IST-1GMT0,M10.5.0,M3.5.0/1' },
    { city: 'Europe/Lisbon',  code: 'WET0WEST,M3.5.0/1,M10.5.0' },
    { city: 'Europe/London', code: 'GMT0BST,M3.5.0/1,M10.5.0' },
    { city: 'Europe/Moscow', code: 'MSK-3' },
    { city: 'Europe/Paris', code: 'CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00' },
    { city: 'Indian/Cocos',  code: '<+0630>-6:30' },
    { city: 'Pacific/Auckland', code: 'NZST-12NZDT,M9.5.0,M4.1.0/3' },
    { city: 'Pacific/Chatham', code: '<+1245>-12:45<+1345>,M9.5.0/2:45,M4.1.0/3:45' },
    { city: 'Pacific/Easter', code: '<-06>6<-05>,M9.1.6/22,M4.1.6/22' },
    { city: 'Pacific/Fiji', code: '<+12>-12<+13>,M11.2.0,M1.2.3/99' },
    { city: 'Pacific/Guam',  code: 'ChST-10' },
    { city: 'Pacific/Honolulu', code: 'HST10' },
    { city: 'Pacific/Marquesas', code: '<-0930>9:30' },
    { city: 'Pacific/Midway',  code: 'SST11' },
    { city: 'Pacific/Norfolk', code: '<+11>-11<+12>,M10.1.0,M4.1.0/3' }
    ];
    loadGeneral() {
        let pnl = document.getElementById('divSystemOptions');
        getJSONSync('/modulesettings', (err, settings) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(settings);
                document.getElementById('spanFwVersion').innerText = settings.fwVersion;
                general.setAppVersion();
                ui.toElement(pnl, { general: settings });
            }
        });
    }
    loadLogin() {
        getJSONSync('/loginContext', (err, ctx) => {
            if (err) ui.serviceError(err);
            else {
                console.log(ctx);
                let pnl = document.getElementById('divContainer');
                pnl.setAttribute('data-securitytype', ctx.type);
                let fld;
                switch (ctx.type) {
                    case 1:
                        document.getElementById('divPinSecurity').style.display = '';
                        fld = document.getElementById('divPinSecurity').querySelector('.pin-digit[data-bind="security.pin.d0"]');
                        document.getElementById('divPinSecurity').querySelector('.pin-digit[data-bind="security.pin.d3"]').addEventListener('digitentered', (evt) => {
                            general.login();
                        });
                        break;
                    case 2:
                        document.getElementById('divPasswordSecurity').style.display = '';
                        fld = document.getElementById('fldUsername');
                        break;
                }
                if (fld) fld.focus();
            }
        });
    }
    setAppVersion() { document.getElementById('spanAppVersion').innerText = this.appVersion; }
    setTimeZones() {
        let dd = document.getElementById('selTimeZone');
        dd.length = 0;
        let maxLength = 0;
        for (let i = 0; i < this.timeZones.length; i++) {
            let opt = document.createElement('option');
            opt.text = this.timeZones[i].city;
            opt.value = this.timeZones[i].code;
            maxLength = Math.max(maxLength, this.timeZones[i].code.length);
            dd.add(opt);
        }
        dd.value = 'UTC0';
        console.log(`Max TZ:${maxLength}`);
    }
    setGeneral() {
        let valid = true;
        let pnl = document.getElementById('divSystemSettings');
        let obj = ui.fromElement(pnl).general;
        if (typeof obj.hostname === 'undefined' || !obj.hostname || obj.hostname === '') {
            ui.errorMessage('Invalid Host Name').querySelector('.sub-message').innerHTML = 'You must supply a valid Host Name.';
            valid = false;
        }
        if (valid && !/^[a-zA-Z0-9-]+$/.test(obj.hostname)) {
            ui.errorMessage('Invalid Host Name').querySelector('.sub-message').innerHTML = 'The host name must only include numbers, letters, or dash.';
            valid = false;
        }
        if (valid && obj.hostname.length > 32) {
            ui.errorMessage('Invalid Host Name').querySelector('.sub-message').innerHTML = 'The maximum Host Name length is 32 characters.';
            valid = false;
        }
        if (valid && typeof obj.ntpServer === 'string' && obj.ntpServer.length > 64) {
            ui.errorMessage('Invalid NTP Server').querySelector('.sub-message').innerHTML = 'The maximum NTP Server length is 64 characters.';
            valid = false;
        }
        if (valid) {
            putJSONSync('/setgeneral', obj, (err, response) => {
                if (err) ui.serviceError(err);
                console.log(response);
            });
        }
    }
    setSecurityConfig(security) {
        // We need to transform the security object so that it can be set to the configuration.
        let obj = {
            security: {
                type: security.type, username: security.username, password: security.password,
                permissions: { configOnly: makeBool(security.permissions & 0x01) },
                pin: {
                    d0: security.pin[0],
                    d1: security.pin[1],
                    d2: security.pin[2],
                    d3: security.pin[3]
                }
            }
        };
        ui.toElement(document.getElementById('divSecurityOptions'), obj);
        this.onSecurityTypeChanged();
    }
    rebootDevice() {
        ui.promptMessage(document.getElementById('divContainer'), 'Are you sure you want to reboot the device?', () => {
            if(typeof socket !== 'undefined') socket.close(3000, 'reboot');
            putJSONSync('/reboot', {}, (err, response) => {
                document.getElementById('btnSaveGeneral').classList.remove('disabled');
                console.log(response);
            });
            ui.clearErrors();
        });
    }
    onSecurityTypeChanged() {
        let pnl = document.getElementById('divSecurityOptions');
        let sec = ui.fromElement(pnl).security;
        switch (sec.type) {
            case 0:
                pnl.querySelector('#divPermissions').style.display = 'none';
                pnl.querySelector('#divPinSecurity').style.display = 'none';
                pnl.querySelector('#divPasswordSecurity').style.display = 'none';
                break;
            case 1:
                pnl.querySelector('#divPermissions').style.display = '';
                pnl.querySelector('#divPinSecurity').style.display = '';
                pnl.querySelector('#divPasswordSecurity').style.display = 'none';
                break;
            case 2:
                pnl.querySelector('#divPermissions').style.display = '';
                pnl.querySelector('#divPinSecurity').style.display = 'none';
                pnl.querySelector('#divPasswordSecurity').style.display = '';
                break;

        }
    }
    saveSecurity() {
        let security = ui.fromElement(document.getElementById('divSecurityOptions')).security;
        console.log(security);
        let sec = { type: security.type, username: security.username, password: security.password, pin: '', perm: 0 };
        // Pin entry.
        for (let i = 0; i < 4; i++) {
            sec.pin += security.pin[`d${i}`];
        }
        sec.permissions |= security.permissions.configOnly ? 0x01 : 0x00;
        let confirm = '';
        console.log(sec);
        if (security.type === 1) { // Pin Entry
            // Make sure our pin is 4 digits.
            if (sec.pin.length !== 4) {
                ui.errorMessage('Invalid Pin').querySelector('.sub-message').innerHTML = 'Pins must be exactly 4 alpha-numeric values in length.  Please enter a complete pin.';
                return;
            }
            confirm = '<p>Please keep your PIN safe and above all remember it.  The only way to recover a lost PIN is to completely reload the onboarding firmware which will wipe out your configuration.</p><p>Have you stored your PIN in a safe place?</p>';
        }
        else if (security.type === 2) { // Password
            if (sec.username.length === 0) {
                ui.errorMessage('No Username Provided').querySelector('.sub-message').innerHTML = 'You must provide a username for password security.';
                return;
            }
            if (sec.username.length > 32) {
                ui.errorMessage('Invalid Username').querySelector('.sub-message').innerHTML = 'The maximum username length is 32 characters.';
                return;
            }

            if (sec.password.length === 0) {
                ui.errorMessage('No Password Provided').querySelector('.sub-message').innerHTML = 'You must provide a password for password security.';
                return;
            }
            if (sec.password.length > 32) {
                ui.errorMessage('Invalid Password').querySelector('.sub-message').innerHTML = 'The maximum password length is 32 characters.';
                return;
            }

            if (security.repeatpassword.length === 0) {
                ui.errorMessage('Re-enter Password').querySelector('.sub-message').innerHTML = 'You must re-enter the password in the Re-enter Password field.';
                return;
            }
            if (sec.password !== security.repeatpassword) {
                ui.errorMessage('Passwords do not Match').querySelector('.sub-message').innerHTML = 'Please re-enter the password exactly as you typed it in the Re-enter Password field.';
                return;
            }
            confirm = '<p>Please keep your password safe and above all remember it.  The only way to recover a password is to completely reload the onboarding firmware which will wipe out your configuration.</p><p>Have you stored your username and password in a safe place?</p>';
        }
        let prompt = ui.promptMessage('Confirm Security', () => {
            putJSONSync('/saveSecurity', sec, (err, objApiKey) => {
                prompt.remove();
                if (err) ui.serviceError(err);
                else {
                    console.log(objApiKey);
                }
            });
        });
        prompt.querySelector('.sub-message').innerHTML = confirm;

    }
}
var general = new General();
class Wifi {
    initialized = false;
    ethBoardTypes = [{ val: 0, label: 'Custom Config' },
    { val: 1, label: 'WT32-ETH01', clk: 0, ct: 0, addr: 1, pwr: 16, mdc: 23, mdio: 18 },
    { val: 2, label: 'Olimex ESP32-POE', clk: 3, ct: 0, addr: 0, pwr: 12, mdc: 23, mdio: 18 },
    { val: 3, label: 'Olimex ESP32-EVB', clk: 0, ct: 0, addr: 0, pwr: -1, mdc: 23, mdio: 18 },
    { val: 4, label: 'LILYGO T-Internet POE', clk: 3, ct: 0, addr: 0, pwr: 16, mdc: 23, mdio: 18 },
    { val: 5, label: 'wESP32 v7+', clk: 0, ct: 2, addr: 0, pwr: -1, mdc: 16, mdio: 17 },
    { val: 6, label: 'wESP32 < v7', clk: 0, ct: 0, addr: 0, pwr: -1, mdc: 16, mdio: 17 }
    ];
    ethClockModes = [{ val: 0, label: 'GPIO0 IN' }, { val: 1, label: 'GPIO0 OUT' }, { val: 2, label: 'GPIO16 OUT' }, { val: 3, label: 'GPIO17 OUT' }];
    ethPhyTypes = [{ val: 0, label: 'LAN8720' }, { val: 1, label: 'TLK110' }, { val: 2, label: 'RTL8201' }, { val: 3, label: 'DP83848' }, { val: 4, label: 'DM9051' }, { val: 5, label: 'KZ8081' }];
    init() {
        document.getElementById("divNetworkStrength").innerHTML = this.displaySignal(-100);
        if (this.initialized) return;
        let addr = [];
        this.loadETHDropdown(document.getElementById('selETHClkMode'), this.ethClockModes);
        this.loadETHDropdown(document.getElementById('selETHPhyType'), this.ethPhyTypes);
        this.loadETHDropdown(document.getElementById('selETHBoardType'), this.ethBoardTypes);
        for (let i = 0; i < 32; i++) addr.push({ val: i, label: `PHY ${i}` });
        this.loadETHDropdown(document.getElementById('selETHAddress'), addr);
        this.loadETHPins(document.getElementById('selETHPWRPin'), 'power');
        this.loadETHPins(document.getElementById('selETHMDCPin'), 'mdc', 23);
        this.loadETHPins(document.getElementById('selETHMDIOPin'), 'mdio', 18);
        ui.toElement(document.getElementById('divNetAdapter'), {
            wifi: {ssid:'', passphrase:''},
            ethernet: { boardType: 1, wirelessFallback: false, dhcp: true, dns1: '', dns2: '', ip: '', gateway: '' }
        });
        this.onETHBoardTypeChanged(document.getElementById('selETHBoardType'));
        this.initialized = true;
    }
    loadETHPins(sel, type, selected) {
        let arr = [];
        switch (type) {
            case 'power':
                arr.push({ val: -1, label: 'None' });
                break;
        }
        for (let i = 0; i < 36; i++) {
            arr.push({ val: i, label: `GPIO ${i}` });
        }
        this.loadETHDropdown(sel, arr, selected);
    }
    loadETHDropdown(sel, arr, selected) {
        while (sel.firstChild) sel.removeChild(sel.firstChild);
        for (let i = 0; i < arr.length; i++) {
            let elem = arr[i];
            sel.options[sel.options.length] = new Option(elem.label, elem.val, elem.val === selected, elem.val === selected);
        }
    }
    onETHBoardTypeChanged(sel) {
        let type = this.ethBoardTypes.find(elem => parseInt(sel.value, 10) === elem.val);
        if (typeof type !== 'undefined') {
            // Change the values to represent what the board type says.
            if(typeof type.ct !== 'undefined') document.getElementById('selETHPhyType').value = type.ct;
            if (typeof type.clk !== 'undefined') document.getElementById('selETHClkMode').value = type.clk;
            if (typeof type.addr !== 'undefined') document.getElementById('selETHAddress').value = type.addr;
            if (typeof type.pwr !== 'undefined') document.getElementById('selETHPWRPin').value = type.pwr;
            if (typeof type.mdc !== 'undefined') document.getElementById('selETHMDCPin').value = type.mdc;
            if (typeof type.mdio !== 'undefined') document.getElementById('selETHMDIOPin').value = type.mdio;
            document.getElementById('divETHSettings').style.display = type.val === 0 ? '' : 'none';
        }
    }
    onDHCPClicked(cb) { document.getElementById('divStaticIP').style.display = cb.checked ? 'none' : ''; }
    loadNetwork() {
        let pnl = document.getElementById('divNetAdapter');
        getJSONSync('/networksettings', (err, settings) => {
            console.log(settings);
            if (err) {
                ui.serviceError(err);
            }
            else {
                document.getElementById('cbHardwired').checked = settings.connType >= 2;
                document.getElementById('cbFallbackWireless').checked = settings.connType === 3;
                ui.toElement(pnl, settings);
                if (settings.connType >= 2) {
                    document.getElementById('divWiFiMode').style.display = 'none';
                    document.getElementById('divEthernetMode').style.display = '';
                    document.getElementById('divFallbackWireless').style.display = 'inline-block';
                }
                else {
                    document.getElementById('divWiFiMode').style.display = '';
                    document.getElementById('divEthernetMode').style.display = 'none';
                    document.getElementById('divFallbackWireless').style.display = 'none';
                }
                document.getElementById('divETHSettings').style.display = settings.ethernet.boardType === 0 ? '' : 'none';
                document.getElementById('divStaticIP').style.display = settings.ip.dhcp ? 'none' : '';
                ui.toElement(document.getElementById('divDHCP'), settings);
            }
        });

    }
    useEthernetClicked() {
        let useEthernet = document.getElementById('cbHardwired').checked;
        document.getElementById('divWiFiMode').style.display = useEthernet ? 'none' : '';
        document.getElementById('divEthernetMode').style.display = useEthernet ? '' : 'none';
        document.getElementById('divFallbackWireless').style.display = useEthernet ? 'inline-block' : 'none';
    }
    async loadAPs() {
        if (document.getElementById('btnScanAPs').classList.contains('disabled')) return;
        document.getElementById('divAps').innerHTML = '<div style="display:flex;justify-content:center;align-items:center;"><div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
        document.getElementById('btnScanAPs').classList.add('disabled');
        //document.getElementById('btnConnectWiFi').classList.add('disabled');
        getJSON('/scanaps', (err, aps) => {
            document.getElementById('btnScanAPs').classList.remove('disabled');
            //document.getElementById('btnConnectWiFi').classList.remove('disabled');
            console.log(aps);
            if (err) {
                this.displayAPs({ connected: { name: '', passphrase: '' }, accessPoints: [] });
            }
            else {
                this.displayAPs(aps);
            }
        });
    }
    displayAPs(aps) {
        let div = '';
        let nets = [];
        for (let i = 0; i < aps.accessPoints.length; i++) {
            let ap = aps.accessPoints[i];
            let p = nets.find(elem => elem.name === ap.name);
            if (typeof p !== 'undefined' && p) {
                p.channel = p.strength > ap.strength ? p.channel : ap.channel;
                p.macAddress = p.strength > ap.strength ? p.macAddress : ap.macAddress;
                p.strength = Math.max(p.strength, ap.strength);
            }
            else
                nets.push(ap);
        }
        // Sort by the best signal strength.
        nets.sort((a, b) => b.strength - a.strength);
        for (let i = 0; i < nets.length; i++) {
            let ap = nets[i];
            div += `<div class="wifiSignal" onclick="wifi.selectSSID(this);" data-channel="${ap.channel}" data-encryption="${ap.encryption}" data-strength="${ap.strength}" data-mac="${ap.macAddress}"><span class="ssid">${ap.name}</span><span class="strength">${this.displaySignal(ap.strength)}</span></div>`;
        }
        let divAps = document.getElementById('divAps');
        divAps.setAttribute('data-lastloaded', new Date().getTime());
        divAps.innerHTML = div;
        //document.getElementsByName('ssid')[0].value = aps.connected.name;
        //document.getElementsByName('passphrase')[0].value = aps.connected.passphrase;
        //this.procWifiStrength(aps.connected);
    }
    selectSSID(el) {
        let obj = {
            name: el.querySelector('span.ssid').innerHTML,
            encryption: el.getAttribute('data-encryption'),
            strength: parseInt(el.getAttribute('data-strength'), 10),
            channel: parseInt(el.getAttribute('data-channel'), 10)
        };
        console.log(obj);
        document.getElementsByName('ssid')[0].value = obj.name;
    }
    calcWaveStrength(sig) {
        let wave = 0;
        if (sig > -90) wave++;
        if (sig > -80) wave++;
        if (sig > -70) wave++;
        if (sig > -67) wave++;
        if (sig > -30) wave++;
        return wave;
    }
    displaySignal(sig) {
        return `<div class="signal waveStrength-${this.calcWaveStrength(sig)}"><div class="wv4 wave"><div class="wv3 wave"><div class="wv2 wave"><div class="wv1 wave"><div class="wv0 wave"></div></div></div></div></div></div>`;
    }
    saveIPSettings() {
        let pnl = document.getElementById('divDHCP');
        let obj = ui.fromElement(pnl).ip;
        console.log(obj);
        if (!obj.dhcp) {
            let fnValidateIP = (addr) => { return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(addr); };
            if (typeof obj.ip !== 'string' || obj.ip.length === 0 || obj.ip === '0.0.0.0') {
                ui.errorMessage('You must supply a valid IP address for the Static IP Address');
                return;
            }
            else if (!fnValidateIP(obj.ip)) {
                ui.errorMessage('Invalid Static IP Address.  IP addresses are in the form XXX.XXX.XXX.XXX');
                return;
            }
            if (typeof obj.subnet !== 'string' || obj.subnet.length === 0 || obj.subnet === '0.0.0.0') {
                ui.errorMessage('You must supply a valid IP address for the Subnet Mask');
                return;
            }
            else if (!fnValidateIP(obj.subnet)) {
                ui.errorMessage('Invalid Subnet IP Address.  IP addresses are in the form XXX.XXX.XXX.XXX');
                return;
            }
            if (typeof obj.gateway !== 'string' || obj.gateway.length === 0 || obj.gateway === '0.0.0.0') {
                ui.errorMessage('You must supply a valid Gateway IP address');
                return;
            }
            else if (!fnValidateIP(obj.gateway)) {
                ui.errorMessage('Invalid Gateway IP Address.  IP addresses are in the form XXX.XXX.XXX.XXX');
                return;
            }
            if (obj.dns1.length !== 0 && !fnValidateIP(obj.dns1)) {
                ui.errorMessage('Invalid Domain Name Server 1 IP Address.  IP addresses are in the form XXX.XXX.XXX.XXX');
                return;
            }
            if (obj.dns2.length !== 0 && !fnValidateIP(obj.dns2)) {
                ui.errorMessage('Invalid Domain Name Server 2 IP Address.  IP addresses are in the form XXX.XXX.XXX.XXX');
                return;
            }
        }
        putJSONSync('/setIP', obj, (err, response) => {
            if (err) {
                ui.serviceError(err);
            }
            console.log(response);
        });
    }
    saveNetwork() {
        let pnl = document.getElementById('divNetAdapter');
        let obj = ui.fromElement(pnl);
        obj.connType = obj.ethernet.hardwired ? obj.ethernet.wirelessFallback ? 3 : 2 : 1;
        console.log(obj);
        if (obj.connType >= 2) {
            let boardType = this.ethBoardTypes.find(elem => obj.ethernet.boardType === elem.val);
            let phyType = this.ethPhyTypes.find(elem => obj.ethernet.phyType === elem.val);
            let clkMode = this.ethClockModes.find(elem => obj.ethernet.CLKMode === elem.val);
            let div = document.createElement('div');
            let html = `<div id="divLanSettings" class="inst-overlay">`;
            html += '<div style="width:100%;color:red;text-align:center;font-weight:bold;"><span style="padding:10px;display:inline-block;width:100%;border-radius:5px;border-top-right-radius:17px;border-top-left-radius:17px;background:white;">BEWARE ... WARNING ... DANGER<span></div>';
            html += '<p style="font-size:14px;">Incorrect Ethernet settings can damage your ESP32.  Please verify the settings below and ensure they match the manufacturer spec sheet.</p>';
            html += '<p style="font-size:14px;margin-bottom:0px;">If you are unsure do not press the Red button and press the Green button.  If any of the settings are incorrect please use the Custom Board type and set them to the correct values.';
            html += '<hr/><div>';
            html += `<div class="eth-setting-line"><label>Board Type</label><span>${boardType.label} [${boardType.val}]</span></div>`;
            html += `<div class="eth-setting-line"><label>PHY Chip Type</label><span>${phyType.label} [${phyType.val}]</span></div>`;
            html += `<div class="eth-setting-line"><label>PHY Address</label><span>${obj.ethernet.phyAddress}</span ></div >`;
            html += `<div class="eth-setting-line"><label>Clock Mode</label><span>${clkMode.label} [${clkMode.val}]</span></div >`;
            html += `<div class="eth-setting-line"><label>Power Pin</label><span>${obj.ethernet.PWRPin === -1 ? 'None' : obj.ethernet.PWRPin}</span></div>`;
            html += `<div class="eth-setting-line"><label>MDC Pin</label><span>${obj.ethernet.MDCPin}</span></div>`;
            html += `<div class="eth-setting-line"><label>MDIO Pin</label><span>${obj.ethernet.MDIOPin}</span></div>`;
            html += '</div>';
            html += `<div class="button-container">`;
            html += `<button id="btnSaveEthernet" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;background:orangered;">Save Ethernet Settings</button>`;
            html += `<button id="btnCancel" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;background:lawngreen;color:gray" onclick="document.getElementById('divLanSettings').remove();">Cancel</button>`;
            html += `</div><form>`;
            div.innerHTML = html;
            document.getElementById('divContainer').appendChild(div);
            div.querySelector('#btnSaveEthernet').addEventListener('click', (el, event) => {
                console.log(obj);
                this.sendNetworkSettings(obj);
                setTimeout(() => { div.remove(); }, 1);
            });
        }
        else {
            this.sendNetworkSettings(obj);
        }
    }
    sendNetworkSettings(obj) {
        putJSONSync('/setNetwork', obj, (err, response) => {
            if (err) {
                ui.serviceError(err);
            }
            console.log(response);
        });
    }
    connectWiFi() {
        if (document.getElementById('btnConnectWiFi').classList.contains('disabled')) return;
        document.getElementById('btnConnectWiFi').classList.add('disabled');
        let obj = {
            ssid: document.getElementsByName('ssid')[0].value,
            passphrase: document.getElementsByName('passphrase')[0].value
        };
        if (obj.ssid.length > 64) {
            ui.errorMessage('Invalid SSID').querySelector('.sub-message').innerHTML = 'The maximum length of the SSID is 64 characters.';
            return;
        }
        if (obj.passphrase.length > 64) {
            ui.errorMessage('Invalid Passphrase').querySelector('.sub-message').innerHTML = 'The maximum length of the passphrase is 64 characters.';
            return;
        }


        let overlay = ui.waitMessage(document.getElementById('divNetAdapter'));
        putJSON('/connectwifi', obj, (err, response) => {
            overlay.remove();
            document.getElementById('btnConnectWiFi').classList.remove('disabled');
            console.log(response);

        });
    }
    procWifiStrength(strength) {
        let ssid = strength.ssid || strength.name;
        document.getElementById('spanNetworkSSID').innerHTML = !ssid || ssid === '' ? '-------------' : ssid;
        document.getElementById('spanNetworkChannel').innerHTML = isNaN(strength.channel) || strength.channel < 0 ? '--' : strength.channel;
        let cssClass = 'waveStrength-' + (isNaN(strength.strength) || strength > 0 ? -100 : this.calcWaveStrength(strength.strength));
        let elWave = document.getElementById('divNetworkStrength').children[0];
        if (typeof elWave !== 'undefined' && !elWave.classList.contains(cssClass)) {
            elWave.classList.remove('waveStrength-0', 'waveStrength-1', 'waveStrength-2', 'waveStrength-3', 'waveStrength-4');
            elWave.classList.add(cssClass);
        }
        document.getElementById('spanNetworkStrength').innerHTML = isNaN(strength.strength) || strength.strength <= -100 ? '----' : strength.strength;
    }
    procEthernet(ethernet) {
        console.log(ethernet);
        document.getElementById('divEthernetStatus').style.display = ethernet.connected ? '' : 'none';
        document.getElementById('divWiFiStrength').style.display = ethernet.connected ? 'none' : '';
        document.getElementById('spanEthernetStatus').innerHTML = ethernet.connected ? 'Connected' : 'Disconnected';
        document.getElementById('spanEthernetSpeed').innerHTML = !ethernet.connected ? '--------' : `${ethernet.speed}Mbps ${ethernet.fullduplex ? 'Full-duplex' : 'Half-duplex'}`;
    }
}
var wifi = new Wifi();
class Somfy {
    initialized = false;
    frames = [];
    init() {
        if (this.initialized) return;
        this.loadPins('inout', document.getElementById('selTransSCKPin'));
        this.loadPins('inout', document.getElementById('selTransCSNPin'));
        this.loadPins('inout', document.getElementById('selTransMOSIPin'));
        this.loadPins('input', document.getElementById('selTransMISOPin'));
        this.loadPins('out', document.getElementById('selTransTXPin'));
        this.loadPins('input', document.getElementById('selTransRXPin'));
        //this.loadSomfy();
        ui.toElement(document.getElementById('divTransceiverSettings'), {
            transceiver: { config: { proto: 0, SCKPin: 18, CSNPin: 5, MOSIPin: 23, MISOPin: 19, TXPin: 12, RXPin: 13, frequency: 433.42, rxBandwidth: 97.96, type:56, deviation: 11.43, txPower: 10, enabled: false } }
        });
        this.initialized = true;
    }
    async loadSomfy() {
        getJSONSync('/controller', (err, somfy) => {
            if (err) {
                console.log(err);
                ui.serviceError(err);
            }
            else {
                console.log(somfy);
                document.getElementById('spanMaxShades').innerText = somfy.maxShades;
                document.getElementById('spanMaxGroups').innerText = somfy.maxGroups;
                ui.toElement(document.getElementById('divTransceiverSettings'), somfy);
                if (somfy.transceiver.config.radioInit) {
                    document.getElementById('divRadioError').style.display = 'none';
                }
                else {
                    document.getElementById('divRadioError').style.display = '';
                }
                // Create the shades list.
                this.setShadesList(somfy.shades);
                this.setGroupsList(somfy.groups);
            }
        });
    }
    saveRadio() {
        let valid = true;
        let getIntValue = (fld) => { return parseInt(document.getElementById(fld).value, 10); };
        let trans = ui.fromElement(document.getElementById('divTransceiverSettings')).transceiver;
        // Check to make sure we have a trans type.
        if (typeof trans.config.type === 'undefined' || trans.config.type === '' || trans.config.type === 'none') {
            ui.errorMessage('You must select a radio type.');
            valid = false;
        }
        // Check to make sure no pins were duplicated and defined
        if (valid) {
            let fnValDup = (o, name) => {
                let val = o[name];
                if (typeof val === 'undefined' || isNaN(val)) {
                    ui.errorMessage(document.getElementById('fsSomfySettings'), 'You must define all the pins for the radio.');
                    return false;
                }
                for (let s in o) {
                    if (s.endsWith('Pin') && s !== name) {
                        let sval = o[s];
                        if (typeof sval === 'undefined' || isNaN(sval)) {
                            ui.errorMessage(document.getElementById('fsSomfySettings'), 'You must define all the pins for the radio.');
                            return false;
                        }
                        if (sval === val) {
                            if ((name === 'TXPin' && s === 'RXPin') ||
                                (name === 'RXPin' && s === 'TXPin'))
                                continue; // The RX and TX pins can share the same value.  In this instance the radio will only use GDO0.
                            else {
                                ui.errorMessage(document.getElementById('fsSomfySettings'), `The ${name.replace('Pin', '')} pin is duplicated by the ${s.replace('Pin', '')}.  All pin definitions must be unique`);
                                valid = false;
                                return false;
                            }
                        }
                    }
                }
                return true;
            };
            if (valid) valid = fnValDup(trans.config, 'SCKPin');
            if (valid) valid = fnValDup(trans.config, 'CSNPin');
            if (valid) valid = fnValDup(trans.config, 'MOSIPin');
            if (valid) valid = fnValDup(trans.config, 'MISOPin');
            if (valid) valid = fnValDup(trans.config, 'TXPin');
            if (valid) valid = fnValDup(trans.config, 'RXPin');
            if (valid) {
                putJSONSync('/saveRadio', trans, (err, trans) => {
                    if (err) 
                        ui.serviceError(err);
                    else {
                        document.getElementById('btnSaveRadio').classList.remove('disabled');
                        if (trans.config.radioInit) {
                            document.getElementById('divRadioError').style.display = 'none';
                        }
                        else {
                            document.getElementById('divRadioError').style.display = '';
                        }
                    }
                    console.log(trans);
                });
            }
        }
    }
    btnDown = null;
    btnTimer = null;
    setShadesList(shades) {
        let divCfg = '';
        let divCtl = '';
        for (let i = 0; i < shades.length; i++) {
            let shade = shades[i];
            divCfg += `<div class="somfyShade" data-shadeid="${shade.shadeId}" data-remoteaddress="${shade.remoteAddress}" data-tilt="${shade.tiltType}" data-shadetype="${shade.shadeType}">`;
            divCfg += `<div class="button-outline" onclick="somfy.openEditShade(${shade.shadeId});"><i class="icss-edit"></i></div>`;
            //divCfg += `<i class="shade-icon" data-position="${shade.position || 0}%"></i>`;
            divCfg += `<span class="shade-name">${shade.name}</span>`;
            divCfg += `<span class="shade-address">${shade.remoteAddress}</span>`;
            divCfg += `<div class="button-outline" onclick="somfy.deleteShade(${shade.shadeId});"><i class="icss-trash"></i></div>`;
            divCfg += '</div>';

            divCtl += `<div class="somfyShadeCtl" data-shadeId="${shade.shadeId}" data-direction="${shade.direction}" data-remoteaddress="${shade.remoteAddress}" data-position="${shade.position}" data-target="${shade.target}" data-mypos="${shade.myPos}" data-mytiltpos="${shade.myTiltPos} data-shadetype="${shade.shadeType}" data-tilt="${shade.tiltType}"`;
            divCtl += ` data-windy="${(shade.flags & 0x10) === 0x10 ? 'true' : false}" data-sunny=${(shade.flags & 0x20) === 0x20 ? 'true' : 'false'}`;
            if (shade.tiltType !== 0) {
                divCtl += ` data-tiltposition="${shade.tiltPosition}" data-tiltdirection="${shade.tiltDirection}" data-tilttarget="${shade.tiltTarget}"`;
            }
            divCtl += `><div class="shade-icon" data-shadeid="${shade.shadeId}" onclick="event.stopPropagation(); console.log(event); somfy.openSetPosition(${shade.shadeId});">`;
            divCtl += `<i class="somfy-shade-icon`;
            switch (shade.shadeType) {
                case 1:
                    divCtl += ' icss-window-blind';
                    break;
                case 3:
                    divCtl += ' icss-awning';
                    break;
                case 4:
                    divCtl += ' icss-shutter';
                    break;
                default:
                    divCtl += ' icss-window-shade';
                    break;
            }
            divCtl += `" data-shadeid="${shade.shadeId}" style="--shade-position:${shade.flipPosition ? 100 - shade.position : shade.position}%;vertical-align: top;"></i>`;
            divCtl += shade.tiltType !== 0 ? `<i class="icss-window-tilt" data-shadeid="${shade.shadeId}" data-tiltposition="${shade.tiltPosition}"></i></div>` : '</div>';
            divCtl += `<div class="indicator indicator-wind"><i class="icss-warning"></i></div><div class="indicator indicator-sun"><i class="icss-sun"></i></div>`;
            divCtl += `<div class="shade-name">`;

            divCtl += `<span class="shadectl-name">${shade.name}</span>`;
            divCtl += `<span class="shadectl-mypos"><label>My: </label><span id="spanMyPos">${shade.myPos > 0 ? shade.myPos + '%' : '---'}</span>`;
            if (shade.myTiltPos > 0) divCtl += `<label> Tilt: </label><span id="spanMyTiltPos">${shade.myTiltPos > 0 ? shade.myTiltPos + '%' : '---'}</span>`;
            divCtl += '</div>';

            divCtl += `<div class="shadectl-buttons">`;
            divCtl += `<div class="button-sunflag cmd-button" data-cmd="sunflag" data-shadeid="${shade.shadeId}" data-on="${shade.flags & 0x01 ? 'true' : 'false'}" style="${!shade.sunSensor ? 'display:none' : ''}"><i class="icss-sun-c"></i><i class="icss-sun-o"></i></div>`;
            divCtl += `<div class="button-outline cmd-button" data-cmd="up" data-shadeid="${shade.shadeId}"><i class="icss-somfy-up"></i></div>`;
            divCtl += `<div class="button-outline cmd-button my-button" data-cmd="my" data-shadeid="${shade.shadeId}" style="font-size:2em;padding:10px;"><span>my</span></div>`;
            divCtl += `<div class="button-outline cmd-button" data-cmd="down" data-shadeid="${shade.shadeId}"><i class="icss-somfy-down" style="margin-top:-4px;"></i></div>`;
            divCtl += '</div></div>';
        }
        document.getElementById('divShadeList').innerHTML = divCfg;
        let shadeControls = document.getElementById('divShadeControls');
        shadeControls.innerHTML = divCtl;
        // Attach the timer for setting the My Position for the shade.
        let btns = shadeControls.querySelectorAll('div.cmd-button');
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener('mouseup', (event) => {
                console.log(this);
                console.log(event);
                console.log('mouseup');
                let cmd = event.currentTarget.getAttribute('data-cmd');
                let shadeId = parseInt(event.currentTarget.getAttribute('data-shadeid'), 10);
                if (this.btnTimer) {
                    console.log({ timer: true, isOn: event.currentTarget.getAttribute('data-on'), cmd: cmd });
                    clearTimeout(this.btnTimer);
                    this.btnTimer = null;
                    if (new Date().getTime() - this.btnDown > 2000) event.preventDefault();
                    else this.sendCommand(shadeId, cmd);
                }
                else if (cmd === 'sunflag') {
                    if (makeBool(event.currentTarget.getAttribute('data-on')))
                        this.sendCommand(shadeId, 'flag');
                    else
                        this.sendCommand(shadeId, 'sunflag');
                }
                else this.sendCommand(shadeId, cmd);
            }, true);
            btns[i].addEventListener('mousedown', (event) => {
                if (this.btnTimer) {
                    clearTimeout(this.btnTimer);
                    this.btnTimer = null;
                }
                console.log(this);
                console.log(event);
                console.log('mousedown');
                let elShade = event.currentTarget.closest('div.somfyShadeCtl');
                let cmd = event.currentTarget.getAttribute('data-cmd');
                let shadeId = parseInt(event.currentTarget.getAttribute('data-shadeid'), 10);
                let el = event.currentTarget.closest('.somfyShadeCtl');
                this.btnDown = new Date().getTime();
                if (cmd === 'my') {
                    if (parseInt(el.getAttribute('data-direction'), 10) === 0) {
                        this.btnTimer = setTimeout(() => {
                            // Open up the set My Position dialog.  We will allow the user to change the position to match
                            // the desired position.
                            this.openSetMyPosition(shadeId);
                        }, 2000);
                    }
                }
                else if (cmd === 'sunflag') return;
                else if (makeBool(elShade.getAttribute('data-tilt'))) {
                    this.btnTimer = setTimeout(() => {
                        this.sendTiltCommand(shadeId, cmd);
                    }, 2000);
                }
            }, true);
            btns[i].addEventListener('touchstart', (event) => {
                if (this.btnTimer) {
                    clearTimeout(this.btnTimer);
                    this.btnTimer = null;
                }
                console.log(this);
                console.log(event);
                console.log('touchstart');
                let elShade = event.currentTarget.closest('div.somfyShadeCtl');
                let cmd = event.currentTarget.getAttribute('data-cmd');
                let shadeId = parseInt(event.currentTarget.getAttribute('data-shadeid'), 10);
                let el = event.currentTarget.closest('.somfyShadeCtl');
                this.btnDown = new Date().getTime();
                if (parseInt(el.getAttribute('data-direction'), 10) === 0) {
                    if (cmd === 'my') {
                        this.btnTimer = setTimeout(() => {
                            // Open up the set My Position dialog.  We will allow the user to change the position to match
                            // the desired position.
                            this.openSetMyPosition(shadeId);
                        }, 2000);
                    }
                    else {
                        if (makeBool(elShade.getAttribute('data-tilt'))) {
                            this.btnTimer = setTimeout(() => {
                                this.sendTiltCommand(shadeId, cmd);
                            }, 2000);
                        }
                    }
                }
            }, true);
        }
    }
    setGroupsList(groups) {
        let divCfg = '';
        let divCtl = '';
        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            divCfg += `<div class="somfyGroup" data-groupid="${group.groupId}" data-remoteaddress="${group.remoteAddress}">`;
            divCfg += `<div class="button-outline" onclick="somfy.openEditGroup(${group.groupId});"><i class="icss-edit"></i></div>`;
            //divCfg += `<i class="Group-icon" data-position="${Group.position || 0}%"></i>`;
            divCfg += `<span class="group-name">${group.name}</span>`;
            divCfg += `<span class="group-address">${group.remoteAddress}</span>`;
            divCfg += `<div class="button-outline" onclick="somfy.deleteGroup(${group.groupId});"><i class="icss-trash"></i></div>`;
            divCfg += '</div>';

            divCtl += `<div class="somfyGroupCtl" data-groupId="${group.groupId}" data-remoteaddress="${group.remoteAddress}">`;
            divCtl += `<div class="group-name">`;
            divCtl += `<span class="groupctl-name">${group.name}</span>`;
            divCtl += `<div class="groupctl-shades">`;
            for (let j = 0; j < group.linkedShades.length; j++) {
                divCtl += '<span>';
                if (j !== 0) divCtl += ', ';
                divCtl += group.linkedShades[j].name;
                divCtl += '</span>';
            }
            divCtl += '</div></div>';
            divCtl += `<div class="groupctl-buttons">`;
            divCtl += `<div class="button-sunflag cmd-button" data-cmd="sunflag" data-groupid="${group.groupId}" data-on="${group.flags & 0x01 ? 'true' : 'false'}" style="${!group.sunSensor ? 'display:none' : ''}"><i class="icss-sun-c"></i><i class="icss-sun-o"></i></div>`;
            divCtl += `<div class="button-outline cmd-button" data-cmd="up" data-groupid="${group.groupId}"><i class="icss-somfy-up"></i></div>`;
            divCtl += `<div class="button-outline cmd-button my-button" data-cmd="my" data-groupid="${group.groupId}" style="font-size:2em;padding:10px;"><span>my</span></div>`;
            divCtl += `<div class="button-outline cmd-button" data-cmd="down" data-groupid="${group.groupId}"><i class="icss-somfy-down" style="margin-top:-4px;"></i></div>`;
            divCtl += '</div></div>';
        }
        document.getElementById('divGroupList').innerHTML = divCfg;
        let groupControls = document.getElementById('divGroupControls');
        groupControls.innerHTML = divCtl;
        // Attach the timer for setting the My Position for the Group.
        let btns = groupControls.querySelectorAll('div.cmd-button');
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', (event) => {
                console.log(this);
                console.log(event);
                let groupId = parseInt(event.currentTarget.getAttribute('data-groupid'), 10);
                let cmd = event.currentTarget.getAttribute('data-cmd');
                if (cmd === 'sunflag') {
                    if (makeBool(event.currentTarget.getAttribute('data-on')))
                        this.sendGroupCommand(groupId, 'flag');
                    else
                        this.sendGroupCommand(groupId, 'sunflag');
                }
                else
                    this.sendGroupCommand(groupId, cmd);
            }, true);
        }
    }
    closeShadePositioners() {
        let ctls = document.querySelectorAll('.shade-positioner');
        for (let i = 0; i < ctls.length; i++) {
            console.log('Closing shade positioner');
            ctls[i].remove();
        }
    }
    openSetMyPosition(shadeId) {
        if (typeof shadeId === 'undefined') return;
        else {
            let shade = document.querySelector(`div.somfyShadeCtl[data-shadeid="${shadeId}"]`);
            if (shade) {
                this.closeShadePositioners();
                let currPos = parseInt(shade.getAttribute('data-position'), 10);
                let currTiltPos = parseInt(shade.getAttribute('data-tiltposition'), 10);
                let myPos = parseInt(shade.getAttribute('data-mypos'), 10);
                let tiltType = parseInt(shade.getAttribute('data-tilt'), 10);
                let myTiltPos = parseInt(shade.getAttribute('data-mytiltpos'), 10);
                let elname = shade.querySelector(`.shadectl-name`);
                let shadeName = elname.innerHTML;
                let html = `<div class="shade-name"><span>${shadeName}</span><div style="float:right;vertical-align:top;cursor:pointer;font-size:12px;margin-top:4px;">`;
                if (myPos >= 0)
                    html += `<div onclick="document.getElementById('slidShadeTarget').value = ${myPos}; document.getElementById('slidShadeTarget').dispatchEvent(new Event('change'));"><span style="display:inline-block;width:47px;">Current:</span><span>${myPos}</span><span>%</span></div>`;
                if (myTiltPos >= 0 && tiltType > 0)
                    html += `<div onclick="document.getElementById('slidShadeTiltTarget').value = ${myTiltPos}; document.getElementById('slidShadeTarget').dispatchEvent(new Event('change'));"><span style="display:inline-block;width:47px;">Tilt:</span><span>${myTiltPos}</span><span>%</span></div>`;
                html += `</div></div >`;
                html += `<input id="slidShadeTarget" name="shadeTarget" type="range" min="0" max="100" step="1" oninput="document.getElementById('spanShadeTarget').innerHTML = this.value;" />`;
                html += `<label for="slidShadeTarget"><span>Target Position </span><span><span id="spanShadeTarget" class="shade-target">${currPos}</span><span>%</span></span></label>`;
                html += '<div id="divTiltTarget" style="display:none;">';
                html += `<input id="slidShadeTiltTarget" name="shadeTiltTarget" type="range" min="0" max="100" step="1" oninput="document.getElementById('spanShadeTiltTarget').innerHTML = this.value;" />`;
                html += `<label for="slidShadeTiltTarget"><span>Target Tilt </span><span><span id="spanShadeTiltTarget" class="shade-target">${currTiltPos}</span><span>%</span></span></label>`;
                html += '</div>';
                html += `<hr></hr>`;
                html += '<div style="text-align:right;width:100%;">';
                html += `<button id="btnSetMyPosition" type="button" style="width:auto;display:inline-block;padding-left:10px;padding-right:10px;margin-top:0px;margin-bottom:10px;margin-right:7px;">Set My Position</button>`;
                html += `<button id="btnCancel" type="button" onclick="somfy.closeShadePositioners();" style="width:auto;display:inline-block;padding-left:10px;padding-right:10px;margin-top:0px;margin-bottom:10px;">Cancel</button>`;
                html += `</div></div>`;
                let div = document.createElement('div');
                div.setAttribute('class', 'shade-positioner shade-my-positioner');
                div.setAttribute('data-shadeid', shadeId);
                div.style.height = 'auto';
                div.innerHTML = html;
                shade.appendChild(div);
                let elTarget = div.querySelector('input#slidShadeTarget');
                let elTiltTarget = div.querySelector('input#slidShadeTiltTarget');
                elTarget.value = currPos;
                elTiltTarget.value = currTiltPos;
                let elBtn = div.querySelector('button#btnSetMyPosition');
                if (tiltType > 0) div.querySelector('div#divTiltTarget').style.display = '';
                let fnProcessChange = () => {
                    let pos = parseInt(elTarget.value, 10);
                    let tilt = parseInt(elTiltTarget.value, 10);
                    if (pos === myPos && (tiltType === 0 || tilt === myTiltPos)) {
                        elBtn.innerHTML = 'Clear My Position';
                        elBtn.style.background = 'orangered';
                    }
                    else {
                        elBtn.innerHTML = 'Set My Position';
                        elBtn.style.background = '';
                    }
                    document.getElementById('spanShadeTiltTarget').innerHTML = tilt;
                    document.getElementById('spanShadeTarget').innerHTML = pos;
                };
                let fnSetMyPosition = () => {
                    let pos = parseInt(elTarget.value, 10);
                    let tilt = parseInt(elTiltTarget.value, 10);
                    somfy.sendShadeMyPosition(shadeId, pos, tilt);
                };
                fnProcessChange();
                elTarget.addEventListener('change', (event) => { fnProcessChange(); });
                elTiltTarget.addEventListener('change', (event) => { fnProcessChange(); });
                elBtn.addEventListener('click', (event) => { fnSetMyPosition(); });

            }
        }
    }
    sendShadeMyPosition(shadeId, pos, tilt) {
        console.log(`Sending My Position for shade id ${shadeId} to ${pos} and ${tilt}`);
        let overlay = ui.waitMessage(document.getElementById('divContainer'));
        putJSON('/setMyPosition', { shadeId: shadeId, pos: pos, tilt: tilt }, (err, response) => {
            this.closeShadePositioners();
            overlay.remove();
            console.log(response);
        });
    }
    setLinkedRemotesList(shade) {
        let divCfg = '';
        for (let i = 0; i < shade.linkedRemotes.length; i++) {
            let remote = shade.linkedRemotes[i];
            divCfg += `<div class="somfyLinkedRemote" data-shadeid="${shade.shadeId}" data-remoteaddress="${remote.remoteAddress}" style="text-align:center;">`;
            divCfg += `<span class="linkedremote-address" style="display:inline-block;width:127px;text-align:left;">${remote.remoteAddress}</span>`;
            divCfg += `<span class="linkedremote-code" style="display:inline-block;width:77px;text-align:left;">${remote.lastRollingCode}</span>`;
            divCfg += `<div class="button-outline" onclick="somfy.unlinkRemote(${shade.shadeId}, ${remote.remoteAddress});"><i class="icss-trash"></i></div>`;
            divCfg += '</div>';
        }
        document.getElementById('divLinkedRemoteList').innerHTML = divCfg;
    }
    setLinkedShadesList(group) {
        let divCfg = '';
        for (let i = 0; i < group.linkedShades.length; i++) {
            let shade = group.linkedShades[i];
            divCfg += `<div class="linked-shade" data-shadeid="${shade.shadeId}" data-remoteaddress="${shade.remoteAddress}">`;
            divCfg += `<span class="linkedshade-name">${shade.name}</span>`;
            divCfg += `<span class="linkedshade-address">${shade.remoteAddress}</span>`;
            divCfg += `<div class="button-outline" onclick="somfy.unlinkGroupShade(${group.groupId}, ${shade.shadeId});"><i class="icss-trash"></i></div>`;
            divCfg += '</div>';
        }
        document.getElementById('divLinkedShadeList').innerHTML = divCfg;
    }
    loadPins(type, sel, opt) {
        while (sel.firstChild) sel.removeChild(sel.firstChild);
        for (let i = 0; i < 40; i++) {
            switch (i) {
                case 6: // SPI Flash Pins
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                    if(type !== 'inout' && type !== 'input') continue;
                    break;
                case 37:
                case 38:
                    continue;
                case 32: // We cannot use this pin with the mask for TX.
                case 33:
                case 34: // Input only
                case 35:
                case 36:
                case 39:
                    if (type !== 'input') continue;
                    break;
            }
            sel.options[sel.options.length] = new Option(`GPIO-${i > 9 ? i.toString() : '0' + i.toString()}`, i, typeof opt !== 'undefined' && opt === i);
        }
    }
    procGroupState(state) {
        console.log(state);
        let flags = document.querySelectorAll(`.button-sunflag[data-groupid="${state.groupId}"]`);
        for (let i = 0; i < flags.length; i++) {
            flags[i].style.display = state.sunSensor ? '' : 'none';
            flags[i].setAttribute('data-on', state.flags & 0x01 === 0x01 ? 'true' : 'false');
        }
    }
    procShadeState(state) {
        console.log(state);
        let icons = document.querySelectorAll(`.somfy-shade-icon[data-shadeid="${state.shadeId}"]`);
        for (let i = 0; i < icons.length; i++) {
            icons[i].style.setProperty('--shade-position', `${state.flipPosition ? 100 - state.position : state.position}%`);
        }
        if (state.tiltType !== 0) {
            let tilts = document.querySelectorAll(`.icss-window-tilt[data-shadeid="${state.shadeId}"]`);
            for (let i = 0; i < tilts.length; i++) {
                tilts[i].setAttribute('data-tiltposition', `${state.tiltPosition}`);
            }
        }
        let flags = document.querySelectorAll(`.button-sunflag[data-shadeid="${state.shadeId}"]`);
        for (let i = 0; i < flags.length; i++) {
            flags[i].style.display = state.sunSensor ? '' : 'none';
            flags[i].setAttribute('data-on', state.flags & 0x01 === 0x01 ? 'true' : 'false');
           
        }
        let divs = document.querySelectorAll(`.somfyShadeCtl[data-shadeid="${state.shadeId}"]`);
        for (let i = 0; i < divs.length; i++) {
            divs[i].setAttribute('data-direction', state.direction);
            divs[i].setAttribute('data-position', state.position);
            divs[i].setAttribute('data-target', state.target);
            divs[i].setAttribute('data-mypos', state.myPos);
            divs[i].setAttribute('data-windy', (state.flags & 0x10) === 0x10 ? 'true' : 'false');
            divs[i].setAttribute('data-sunny', (state.flags & 0x20) === 0x20 ? 'true' : 'false');
            if (typeof state.myTiltPos !== 'undefined') divs[i].setAttribute('data-mytiltpos', state.myTiltPos);
            else divs[i].setAttribute('data-mytiltpos', -1);
            if (state.tiltType !== 0) {
                divs[i].setAttribute('data-tiltdirection', state.tiltDirection);
                divs[i].setAttribute('data-tiltposition', state.tiltPosition);
                divs[i].setAttribute('data-tilttarget', state.tiltTarget);
            }
            let span = divs[i].querySelector('#spanMyPos');
            if (span) span.innerHTML = typeof state.mypos !== 'undefined' && state.mypos >= 0 ? `${state.mypos}%` : '---';
            span = divs[i].querySelector('#spanMyTiltPos');
            if (span) span.innerHTML = typeof state.myTiltPos !== 'undefined' && state.myTiltPos >= 0 ? `${state.myTiltPos}%` : '---';
        }
    }
    procRemoteFrame(frame) {
        console.log(frame);
        document.getElementById('spanRssi').innerHTML = frame.rssi;
        document.getElementById('spanFrameCount').innerHTML = parseInt(document.getElementById('spanFrameCount').innerHTML, 10) + 1;
        let lnk = document.getElementById('divLinking');
        if (lnk) {
            let obj = {
                shadeId: parseInt(lnk.dataset.shadeid, 10),
                remoteAddress: frame.address,
                rollingCode: frame.rcode
            };
            let overlay = ui.waitMessage(document.getElementById('divLinking'));
            putJSON('/linkRemote', obj, (err, shade) => {
                console.log(shade);
                overlay.remove();
                lnk.remove();
                this.setLinkedRemotesList(shade);
            });
        }
        let frames = document.getElementById('divFrames');
        let row = document.createElement('div');
        row.classList.add('frame-row');
        row.setAttribute('data-valid', frame.valid);
        // The socket is not sending the current date so we will snag the current receive date from
        // the browser.
        let fnFmtDate = (dt) => {
            return `${(dt.getMonth() + 1).fmt('00')}/${dt.getDate().fmt('00')} ${dt.getHours().fmt('00')}:${dt.getMinutes().fmt('00')}:${dt.getSeconds().fmt('00')}.${dt.getMilliseconds().fmt('000')}`;
        };
        let fnFmtTime = (dt) => {
            return `${dt.getHours().fmt('00')}:${dt.getMinutes().fmt('00')}:${dt.getSeconds().fmt('00')}.${dt.getMilliseconds().fmt('000')}`;
        };
        frame.time = new Date();
        let proto = '-S';
        switch (frame.proto) {
            case 1:
                proto = '-W';
                break;
            case 2:
                proto = '-V';
                break;
        }
        let html = `<span>${frame.encKey}</span><span>${frame.address}</span><span>${frame.command}</span><span>${frame.rcode}</span><span>${frame.rssi}dBm</span><span>${frame.bits}${proto}</span><span>${fnFmtTime(frame.time)}</span><div class="frame-pulses">`;
        for (let i = 0; i < frame.pulses.length; i++) {
            if (i !== 0) html += ',';
            html += `${frame.pulses[i]}`;
        }
        html += '</div>';
        row.innerHTML = html;
        frames.prepend(row);
        this.frames.push(frame);
    }
    JSONPretty(obj, indent = 2) {
        if (Array.isArray(obj)) {
            let output = '[';
            for (let i = 0; i < obj.length; i++) {
                if (i !== 0) output += ',\n';
                output += this.JSONPretty(obj[i], indent);
            }
            output += ']';
            return output;
        }
        else {
            let output = JSON.stringify(obj, function (k, v) {
                if (Array.isArray(v)) return JSON.stringify(v);
                return v;
            }, indent).replace(/\\/g, '')
                .replace(/\"\[/g, '[')
                .replace(/\]\"/g, ']')
                .replace(/\"\{/g, '{')
                .replace(/\}\"/g, '}')
                .replace(/\{\n\s+/g, '{');
            return output;
        }
    }
    framesToClipboard() {
        if (typeof navigator.clipboard !== 'undefined')
            navigator.clipboard.writeText(this.JSONPretty(this.frames, 2));
        else {
            let dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = this.JSONPretty(this.frames, 2);
            dummy.focus();
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
        }
    }
    onShadeTypeChanged(el) {
        let sel = document.getElementById('selShadeType');
        let tilt = parseInt(document.getElementById('selTiltType').value, 10);
        let ico = document.getElementById('icoShade');
        switch (parseInt(sel.value, 10)) {
            case 1:
                document.getElementById('divTiltSettings').style.display = '';
                if (ico.classList.contains('icss-window-shade')) ico.classList.remove('icss-window-shade');
                if (ico.classList.contains('icss-awning')) ico.classList.remove('icss-awning');
                if (ico.classList.contains('icss-shutter')) ico.classList.remove('icss-shutter');
                if (!ico.classList.contains('icss-window-blind')) ico.classList.add('icss-window-blind');
                break;
            case 3:
                document.getElementById('divTiltSettings').style.display = 'none';
                if (ico.classList.contains('icss-window-shade')) ico.classList.remove('icss-window-shade');
                if (ico.classList.contains('icss-window-blind')) ico.classList.remove('icss-window-blind');
                if (ico.classList.contains('icss-shutter')) ico.classList.remove('icss-shutter');
                if (!ico.classList.contains('icss-awning')) ico.classList.add('icss-awning');
                break;
            case 4:
                document.getElementById('divTiltSettings').style.display = 'none';
                if (ico.classList.contains('icss-window-shade')) ico.classList.remove('icss-window-shade');
                if (ico.classList.contains('icss-window-blind')) ico.classList.remove('icss-window-blind');
                if (ico.classList.contains('icss-awning')) ico.classList.remove('icss-awning');
                if (!ico.classList.contains('icss-shutter')) ico.classList.add('icss-shutter');
                break;

            default:
                if (ico.classList.contains('icss-window-blind')) ico.classList.remove('icss-window-blind');
                if (ico.classList.contains('icss-awning')) ico.classList.remove('icss-awning');
                if (!ico.classList.contains('icss-window-shade')) ico.classList.add('icss-window-shade');
                if (ico.classList.contains('icss-shutter')) ico.classList.remove('icss-shutter');
                document.getElementById('divTiltSettings').style.display = 'none';
                tilt = false;
                break;
        }
        document.getElementById('fldTiltTime').parentElement.style.display = tilt ? 'inline-block' : 'none';
        document.querySelector('#divSomfyButtons i.icss-window-tilt').style.display = tilt ? '' : 'none';
    }
    onShadeBitLengthChanged(el) {
        document.getElementById('divStepSettings').style.display = parseInt(el.value, 10) === 80 ? '' : 'none';
    }
    openEditShade(shadeId) {
        if (typeof shadeId === 'undefined') {
            getJSONSync('/getNextShade', (err, shade) => {
                document.getElementById('btnPairShade').style.display = 'none';
                document.getElementById('btnUnpairShade').style.display = 'none';
                document.getElementById('btnLinkRemote').style.display = 'none';
                document.getElementById('btnSaveShade').innerText = 'Add Shade';
                document.getElementById('spanShadeId').innerText = '*';
                document.getElementById('divLinkedRemoteList').innerHTML = '';
                document.getElementById('btnSetRollingCode').style.display = 'none';
                document.getElementById('selShadeBitLength').value = 56;
                document.getElementById('cbFlipCommands').value = false;
                document.getElementById('cbFlipPosition').value = false;

                if (err) {
                    ui.serviceError(err);
                }
                else {
                    console.log(shade);
                    shade.name = '';
                    shade.downTime = shade.upTime = 10000;
                    shade.tiltTime = 7000;
                    shade.flipCommands = shade.flipPosition = false;
                    ui.toElement(document.getElementById('somfyShade'), shade);
                    this.showEditShade(true);
                }
            });
        }
        else {
            // Load up an exist shade.
            document.getElementById('btnSaveShade').style.display = 'none';
            document.getElementById('btnPairShade').style.display = 'none';
            document.getElementById('btnUnpairShade').style.display = 'none';
            document.getElementById('btnLinkRemote').style.display = 'none';

            document.getElementById('btnSaveShade').innerText = 'Save Shade';
            document.getElementById('spanShadeId').innerText = shadeId;
            getJSONSync(`/shade?shadeId=${shadeId}`, (err, shade) => {
                if (err) {
                    ui.serviceError(err);
                }
                else {
                    console.log(shade);
                    ui.toElement(document.getElementById('somfyShade'), shade);
                    this.showEditShade(true);
                    document.getElementById('btnSaveShade').style.display = 'inline-block';
                    document.getElementById('btnLinkRemote').style.display = '';
                    this.onShadeTypeChanged(document.getElementById('selShadeType'));
                    let ico = document.getElementById('icoShade');
                    switch (shade.shadeType) {
                        case 1:
                            ico.classList.remove('icss-window-shade');
                            ico.classList.add('icss-window-blind');
                            break;
                        case 3:
                            ico.classList.remove('icss-window-shade');
                            ico.classList.add('icss-awning');
                            break;
                        case 4:
                            ico.classList.remove('icss-window-shade');
                            ico.classList.add('icss-shutter');
                            break;
                    }
                    let tilt = ico.parentElement.querySelector('i.icss-window-tilt');
                    tilt.style.display = shade.tiltType !== 0 ? '' : 'none';
                    tilt.setAttribute('data-tiltposition', shade.tiltPosition);
                    tilt.setAttribute('data-shadeid', shade.shadeId);
                    ico.style.setProperty('--shade-position', `${shade.flipPosition ? 100 - shade.position : shade.position}%`);
                    ico.style.setProperty('--tilt-position', `${shade.flipPosition ? 100 - shade.tiltPosition : shade.tiltPosition}%`);
                    ico.setAttribute('data-shadeid', shade.shadeId);
                    somfy.onShadeBitLengthChanged(document.getElementById('selShadeBitLength'));
                    document.getElementById('btnSetRollingCode').style.display = 'inline-block';
                    if (shade.paired) {
                        document.getElementById('btnUnpairShade').style.display = 'inline-block';
                    }
                    else {
                        document.getElementById('btnPairShade').style.display = 'inline-block';
                    }
                    this.setLinkedRemotesList(shade);
                }
            });
        }
    }
    openEditGroup(groupId) {
        document.getElementById('btnLinkShade').style.display = 'none';
        if (typeof groupId === 'undefined') {
            getJSONSync('/getNextGroup', (err, group) => {
                document.getElementById('btnSaveGroup').innerText = 'Add Group';
                document.getElementById('spanGroupId').innerText = '*';
                document.getElementById('divLinkedShadeList').innerHTML = '';
                //document.getElementById('btnSetRollingCode').style.display = 'none';
                if (err) {
                    ui.serviceError(err);
                }
                else {
                    console.log(group);
                    group.name = '';
                    ui.toElement(document.getElementById('somfyGroup'), group);
                    this.showEditGroup(true);
                }
            });
        }
        else {
            // Load up an existing group.
            document.getElementById('btnSaveGroup').style.display = 'none';
            document.getElementById('btnSaveGroup').innerText = 'Save Group';
            document.getElementById('spanGroupId').innerText = groupId;
            getJSONSync(`/group?groupId=${groupId}`, (err, group) => {
                if (err) {
                    ui.serviceError(err);
                }
                else {
                    console.log(group);
                    ui.toElement(document.getElementById('somfyGroup'), group);
                    this.showEditGroup(true);
                    document.getElementById('btnSaveGroup').style.display = 'inline-block';
                    document.getElementById('btnLinkShade').style.display = '';
                    document.getElementById('btnSetRollingCode').style.display = 'inline-block';
                    this.setLinkedShadesList(group);
                }
            });
        }
    }
    showEditShade(bShow) {
        let el = document.getElementById('divLinking');
        if (el) el.remove();
        el = document.getElementById('divPairing');
        if (el) el.remove();
        el = document.getElementById('divRollingCode');
        if (el) el.remove();
        el = document.getElementById('somfyShade');
        if (el) el.style.display = bShow ? '' : 'none';
        el = document.getElementById('divShadeListContainer');
        if (el) el.style.display = bShow ? 'none' : '';
    }
    showEditGroup(bShow) {
        let el = document.getElementById('divLinking');
        if (el) el.remove();
        el = document.getElementById('divPairing');
        if (el) el.remove();
        el = document.getElementById('divRollingCode');
        if (el) el.remove();
        el = document.getElementById('somfyGroup');
        if (el) el.style.display = bShow ? '' : 'none';
        el = document.getElementById('divGroupListContainer');
        if (el) el.style.display = bShow ? 'none' : '';
    }
    saveShade() {
        let shadeId = parseInt(document.getElementById('spanShadeId').innerText, 10);
        let obj = ui.fromElement(document.getElementById('somfyShade'));
        let valid = true;
        if (valid && (isNaN(obj.remoteAddress) || obj.remoteAddress < 1 || obj.remoteAddress > 16777215)) {
            ui.errorMessage(document.getElementById('fsSomfySettings'), 'The remote address must be a number between 1 and 16777215.  This number must be unique for all shades.');
            valid = false;
        }
        if (valid && (typeof obj.name !== 'string' || obj.name === '' || obj.name.length > 20)) {
            ui.errorMessage(document.getElementById('fsSomfySettings'), 'You must provide a name for the shade between 1 and 20 characters.');
            valid = false;
        }
        if (valid && (isNaN(obj.upTime) || obj.upTime < 1 || obj.upTime > 4294967295)) {
            ui.errorMessage(document.getElementById('fsSomfySettings'), 'Up Time must be a value between 0 and 4,294,967,295 milliseconds.  This is the travel time to go from full closed to full open.');
            valid = false;
        }
        if (valid && (isNaN(obj.downTime) || obj.downTime < 1 || obj.downTime > 4294967295)) {
            ui.errorMessage(document.getElementById('fsSomfySettings'), 'Down Time must be a value between 0 and 4,294,967,295 milliseconds.  This is the travel time to go from full open to full closed.');
            valid = false;
        }
        if (valid) {
            if (isNaN(shadeId) || shadeId >= 255) {
                // We are adding.
                putJSONSync('/addShade', obj, (err, shade) => {
                    if (err) ui.serviceError(err);
                    else {
                        console.log(shade);
                        document.getElementById('spanShadeId').innerText = shade.shadeId;
                        document.getElementById('btnSaveShade').innerText = 'Save Shade';
                        document.getElementById('btnSaveShade').style.display = 'inline-block';
                        document.getElementById('btnLinkRemote').style.display = '';
                        document.getElementById(shade.paired ? 'btnUnpairShade' : 'btnPairShade').style.display = 'inline-block';
                        document.getElementById('btnSetRollingCode').style.display = 'inline-block';
                        this.updateShadeList();
                    }
                });
            }
            else {
                obj.shadeId = shadeId;
                putJSONSync('/saveShade', obj, (err, shade) => {
                    if (err) ui.serviceError(err);
                    else this.updateShadeList();
                    console.log(shade);
                });
            }
        }
    }
    saveGroup() {
        let groupId = parseInt(document.getElementById('spanGroupId').innerText, 10);
        let obj = ui.fromElement(document.getElementById('somfyGroup'));
        let valid = true;
        if (valid && (isNaN(obj.remoteAddress) || obj.remoteAddress < 1 || obj.remoteAddress > 16777215)) {
            ui.errorMessage('The remote address must be a number between 1 and 16777215.  This number must be unique for all shades.');
            valid = false;
        }
        if (valid && (typeof obj.name !== 'string' || obj.name === '' || obj.name.length > 20)) {
            ui.errorMessage('You must provide a name for the shade between 1 and 20 characters.');
            valid = false;
        }
        if (valid) {
            if (isNaN(groupId) || groupId >= 255) {
                // We are adding.
                putJSONSync('/addGroup', obj, (err, group) => {
                    if (err) ui.serviceError(err);
                    else {
                        console.log(group);
                        document.getElementById('spanGroupId').innerText = group.groupId;
                        document.getElementById('btnSaveGroup').innerText = 'Save Group';
                        document.getElementById('btnSaveGroup').style.display = 'inline-block';
                        document.getElementById('btnLinkShade').style.display = '';
                        //document.getElementById('btnSetRollingCode').style.display = 'inline-block';
                        this.updateGroupList();
                    }
                });
            }
            else {
                obj.groupId = groupId;
                putJSONSync('/saveGroup', obj, (err, shade) => {
                    if (err) ui.serviceError(err);
                    else this.updateGroupList();
                    console.log(shade);
                });
            }
        }
    }
    updateShadeList() {
        getJSONSync('/shades', (err, shades) => {
            if (err) {
                console.log(err);
                ui.serviceError(err);
            }
            else {
                console.log(shades);
                // Create the shades list.
                this.setShadesList(shades);
            }
        });
    }
    updateGroupList() {
        getJSONSync('/groups', (err, groups) => {
            if (err) {
                console.log(err);
                ui.serviceError(err);
            }
            else {
                console.log(groups);
                // Create the groups list.
                this.setGroupsList(groups);
            }
        });
    }
    deleteShade(shadeId) {
        let valid = true;
        if (isNaN(shadeId) || shadeId >= 255 || shadeId <= 0) {
            ui.errorMessage('A valid shade id was not supplied.');
            valid = false;
        }
        if (valid) {
            getJSONSync(`/shade?shadeId=${shadeId}`, (err, shade) => {
                if (err) ui.serviceError(err);
                else if (shade.inGroup) ui.errorMessage(`You may not delete this shade because it is a member of a group.`);
                else {
                    let prompt = ui.promptMessage(`Are you sure you want to delete this shade?`, () => {
                        ui.clearErrors();
                        putJSONSync('/deleteShade', { shadeId: shadeId }, (err, shade) => {
                            this.updateShadeList();
                            prompt.remove;
                        });
                    });
                    prompt.querySelector('.sub-message').innerHTML = `<p>If this shade was previously paired with a motor, you should first unpair it from the motor and remove it from any groups.  Otherwise its address will remain in the motor memory.</p><p>Press YES to delete ${shade.name} or NO to cancel this operation.</p>`;
                }
            });
        }
    }
    deleteGroup(groupId) {
        let valid = true;
        if (isNaN(groupId) || groupId >= 255 || groupId <= 0) {
            ui.errorMessage('A valid shade id was not supplied.');
            valid = false;
        }
        if (valid) {
            getJSONSync(`/group?groupId=${groupId}`, (err, group) => {
                if (err) ui.serviceError(err);
                else {
                    if (group.linkedShades.length > 0) {
                        ui.errorMessage('You may not delete this group until all shades have been removed from it.');
                    }
                    else {
                        let prompt = ui.promptMessage(`Are you sure you want to delete this group?`, () => {
                            putJSONSync('/deleteGroup', { groupId: groupId }, (err, g) => {
                                if (err) ui.serviceError(err);
                                this.updateGroupList();
                                prompt.remove();
                            });

                        });
                        prompt.querySelector('.sub-message').innerHTML = `<p>Press YES to delete the ${group.name} group or NO to cancel this operation.</p>`;
                        
                    }
                }
            });
        }
    }
    sendPairCommand(shadeId) {
        putJSON('/pairShade', { shadeId: shadeId }, (err, shade) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(shade);
                document.getElementById('somfyMain').style.display = 'none';
                document.getElementById('somfyShade').style.display = '';
                document.getElementById('btnSaveShade').style.display = 'inline-block';
                document.getElementById('btnLinkRemote').style.display = '';
                document.getElementsByName('shadeAddress')[0].value = shade.remoteAddress;
                document.getElementsByName('shadeName')[0].value = shade.name;
                document.getElementsByName('shadeUpTime')[0].value = shade.upTime;
                document.getElementsByName('shadeDownTime')[0].value = shade.downTime;
                let ico = document.getElementById('icoShade');
                ico.style.setProperty('--shade-position', `${shade.flipPosition ? 100 - shade.position : shade.position}%`);
                ico.setAttribute('data-shadeid', shade.shadeId);
                if (shade.paired) {
                    document.getElementById('btnUnpairShade').style.display = 'inline-block';
                    document.getElementById('btnPairShade').style.display = 'none';
                }
                else {
                    document.getElementById('btnPairShade').style.display = 'inline-block';
                    document.getElementById('btnUnpairShade').style.display = 'none';
                }
                this.setLinkedRemotesList(shade);
                document.getElementById('divPairing').remove();
            }

        });
    }
    sendUnpairCommand(shadeId) {
        putJSON('/unpairShade', { shadeId: shadeId }, (err, shade) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(shade);
                document.getElementById('somfyMain').style.display = 'none';
                document.getElementById('somfyShade').style.display = '';
                document.getElementById('btnSaveShade').style.display = 'inline-block';
                document.getElementById('btnLinkRemote').style.display = '';
                document.getElementsByName('shadeAddress')[0].value = shade.remoteAddress;
                document.getElementsByName('shadeName')[0].value = shade.name;
                document.getElementsByName('shadeUpTime')[0].value = shade.upTime;
                document.getElementsByName('shadeDownTime')[0].value = shade.downTime;
                let ico = document.getElementById('icoShade');
                ico.style.setProperty('--shade-position', `${shade.flipPosition ? 100 - shade.position : shade.position}%`);
                ico.setAttribute('data-shadeid', shade.shadeId);
                if (shade.paired) {
                    document.getElementById('btnUnpairShade').style.display = 'inline-block';
                    document.getElementById('btnPairShade').style.display = 'none';
                }
                else {
                    document.getElementById('btnPairShade').style.display = 'inline-block';
                    document.getElementById('btnUnpairShade').style.display = 'none';
                }
                this.setLinkedRemotesList(shade);
                document.getElementById('divPairing').remove();
            }
        });
    }
    setRollingCode(shadeId, rollingCode) {
        putJSONSync('/setRollingCode', { shadeId: shadeId, rollingCode: rollingCode }, (err, shade) => {
            if (err) ui.serviceError(document.getElementById('fsSomfySettings'), err);
            else {
                let dlg = document.getElementById('divRollingCode');
                if (dlg) dlg.remove();
            }
        });
    }
    openSetRollingCode(shadeId) {
        let overlay = ui.waitMessage(document.getElementById('divContainer'));
        getJSON(`/shade?shadeId=${shadeId}`, (err, shade) => {
            overlay.remove();
            if (err) {
                ui.serviceError(err);
            }
            else {
                console.log(shade);
                let div = document.createElement('div');
                div.setAttribute('id', 'divRollingCode');
                let html = `<div class="instructions" data-shadeid="${shadeId}">`;
                html += '<div style="width:100%;color:red;text-align:center;font-weight:bold;"><span style="background:yellow;padding:10px;display:inline-block;border-radius:5px;background:white;">BEWARE ... WARNING ... DANGER<span></div>';
                html += '<hr style="width:100%;margin:0px;"></hr>';
                html += '<p style="font-size:14px;">If this shade is already paired with a motor then changing the rolling code WILL cause it to stop working.  Rolling codes are tied to the remote address and the Somfy motor expects these to be sequential.</p>';
                html += '<p style="font-size:14px;">If you hesitated just a little bit do not press the red button.  Green represents safety so press it, wipe the sweat from your brow, and go through the normal pairing process.';
                html += '<div class="field-group" style="border-radius:5px;background:white;width:50%;margin-left:25%;text-align:center">';
                html += `<input id="fldNewRollingCode" min="0" max="65535" name="newRollingCode" type="number" length="12" style="text-align:center;font-size:24px;" placeholder="New Code" value="${shade.lastRollingCode}"></input>`;
                html += '<label for="fldNewRollingCode">Rolling Code</label>';
                html += '</div>';
                html += `<div class="button-container">`;
                html += `<button id="btnChangeRollingCode" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;background:orangered;" onclick="somfy.setRollingCode(${shadeId}, parseInt(document.getElementById('fldNewRollingCode').value, 10));">Set Rolling Code</button>`;
                html += `<button id="btnCancel" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;background:lawngreen;color:gray" onclick="document.getElementById('divRollingCode').remove();">Cancel</button>`;
                html += `</div>`;
                div.innerHTML = html;
                document.getElementById('somfyShade').appendChild(div);
            }
        });
    }
    setPaired(shadeId, paired) {
        let obj = { shadeId: shadeId, paired: paired || false };
        let div = document.getElementById('divPairing');
        let overlay = typeof div === 'undefined' ? undefined : ui.waitMessage(div);
        putJSONSync('/setPaired', obj, (err, shade) => {
            if (overlay) overlay.remove();
            if (err) {
                console.log(err);
                ui.errorMessage(err.message);
            }
            else if (div) {
                console.log(shade);
                this.showEditShade(true);
                document.getElementById('btnSaveShade').style.display = 'inline-block';
                document.getElementById('btnLinkRemote').style.display = '';
                if (shade.paired) {
                    document.getElementById('btnUnpairShade').style.display = 'inline-block';
                    document.getElementById('btnPairShade').style.display = 'none';
                }
                else {
                    document.getElementById('btnPairShade').style.display = 'inline-block';
                    document.getElementById('btnUnpairShade').style.display = 'none';
                }
                this.setLinkedRemotesList(shade);
                div.remove();
            }
        });
    }
    pairShade(shadeId) {
        let div = document.createElement('div');
        let html = `<div id="divPairing" class="instructions" data-type="link-remote" data-shadeid="${shadeId}">`;
        html += '<div>Follow the instructions below to pair this shade with a Somfy motor</div>';
        html += '<hr style="width:100%;margin:0px;"></hr>';
        html += '<ul style="width:100%;margin:0px;padding-left:20px;font-size:14px;">';
        html += '<li>Open the shade memory using an existing remote</li>';
        html += '<li>Press the prog button on the back of the remote until the shade jogs</li>';
        html += '<li>After the shade jogs press the Prog button below</li>';
        html += '<li>The shade should jog again indicating that the shade is paired</li>';
        html += '<li>If the shade jogs, you can press the shade paired button.</li>';
        html += '<li>If the shade does not jog, press the prog button again.</li>';
        html += '</ul>';
        html += `<div class="button-container">`;
        html += `<button id="btnSendPairing" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;" onclick="somfy.sendCommand(${shadeId}, 'prog', 1);">Prog</button>`;
        html += `<button id="btnMarkPaired" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;" onclick="somfy.setPaired(${shadeId}, true);">Shade Paired</button>`;
        html += `<button id="btnStopPairing" type="button" style="padding-left:20px;padding-right:20px;display:inline-block" onclick="document.getElementById('divPairing').remove();">Close</button>`;
        html += `</div>`;
        div.innerHTML = html;
        document.getElementById('somfyShade').appendChild(div);
        return div;
    }
    unpairShade(shadeId) {
        let div = document.createElement('div');
        let html = `<div id="divPairing" class="instructions" data-type="link-remote" data-shadeid="${shadeId}">`;
        html += '<div>Follow the instructions below to unpair this shade from a Somfy motor</div>';
        html += '<hr style="width:100%;margin:0px;"></hr>';
        html += '<ul style="width:100%;margin:0px;padding-left:20px;font-size:14px;">';
        html += '<li>Open the shade memory using an existing remote</li>';
        html += '<li>Press the prog button on the back of the remote until the shade jogs</li>';
        html += '<li>After the shade jogs press the Prog button below</li>';
        html += '<li>The shade should jog again indicating that the shade is unpaired</li>';
        html += '<li>If the shade jogs, you can press the shade unpaired button.</li>';
        html += '<li>If the shade does not jog, press the prog button again until the shade jogs.</li>';
        html += '</ul>';
        html += `<div class="button-container">`;
        html += `<button id="btnSendUnpairing" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;" onclick="somfy.sendCommand(${shadeId}, 'prog', 1);">Prog</button>`;
        html += `<button id="btnMarkPaired" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;" onclick="somfy.setPaired(${shadeId}, false);">Shade Unpaired</button>`;
        html += `<button id="btnStopUnpairing" type="button" style="padding-left:20px;padding-right:20px;display:inline-block" onclick="document.getElementById('divPairing').remove();">Close</button>`;
        html += `</div>`;
        div.innerHTML = html;
        document.getElementById('somfyShade').appendChild(div);
        return div;
    }
    sendCommand(shadeId, command, repeat) {
        console.log(`Sending Shade command ${shadeId}-${command}`);
        let obj = { shadeId: shadeId };
        if (isNaN(parseInt(command, 10))) obj.command = command;
        else obj.target = parseInt(command, 10);
        if (typeof repeat === 'number') obj.repeat = parseInt(repeat);
        putJSON('/shadeCommand', obj, (err, shade) => {

        });
    }
    sendGroupCommand(groupId, command, repeat) {
        console.log(`Sending Group command ${groupId}-${command}`);
        let obj = { groupId: groupId };
        if (isNaN(parseInt(command, 10))) obj.command = command;
        if (typeof repeat === 'number') obj.repeat = parseInt(repeat);
        putJSON('/groupCommand', obj, (err, group) => {

        });
    }
    sendTiltCommand(shadeId, command) {
        console.log(`Sending Tilt command ${shadeId}-${command}`);
        if (isNaN(parseInt(command, 10)))
            putJSON('/tiltCommand', { shadeId: shadeId, command: command }, (err, shade) => {
            });
        else
            putJSON('/tiltCommand', { shadeId: shadeId, target: parseInt(command, 10) }, (err, shade) => {
            });
    }
    linkRemote(shadeId) {
        let div = document.createElement('div');
        let html = `<div id="divLinking" class="instructions" data-type="link-remote" data-shadeid="${shadeId}">`;
        html += '<div>Press any button on the remote to link it to this shade.  This will not change the pairing for the remote and this screen will close when the remote is detected.</div>';
        html += '<hr></hr>';
        html += `<div><div class="button-container"><button id="btnStopLinking" type="button" style="padding-left:20px;padding-right:20px;" onclick="document.getElementById('divLinking').remove();">Cancel</button></div>`;
        html += '</div>';
        div.innerHTML = html;
        document.getElementById('somfyShade').appendChild(div);
        return div;
    }
    linkGroupShade(groupId) {
        let div = document.createElement('div');
        let html = `<div id="divLinkGroup" class="inst-overlay wizard" data-type="link-shade" data-groupid="${groupId}" data-stepid="1">`;
        html += '<div style="width:100%;text-align:center;font-weight:bold;"><div style="padding:10px;display:inline-block;width:100%;color:#00bcd4;border-radius:5px;border-top-right-radius:17px;border-top-left-radius:17px;background:white;"><div>ADD SHADE TO GROUP</div><div id="divGroupName" style="font-size:14px;"></div></div></div>';

        html += '<div class="wizard-step" data-stepid="1">';
        html += '<p style="font-size:14px;">This wizard will walk you through the steps required to add shades into a group.  Follow all instructions at each step until the shade is added to the group.</p>';
        html += '<p style="font-size:14px;">During this process the shade should jog exactly two times.  The first time indicates that the motor memory has been enabled and the second time adds the group to the motor memory</p>';
        html += '<p style="font-size:14px;">Each shade must be paired individually to the group.  When you are ready to begin pairing your shade to the group press the NEXT button.</p><hr></hr>';
       
        html += '</div>';

        html += '<div class="wizard-step" data-stepid="2">';
        html += '<p style="font-size:14px;">Choose a shade that you would like to include in this group.  Once you have chosen the shade to include in the link press the NEXT button.</p>';
        html += '<p style="font-size:14px;">Only shades that have not already been included in this group are available the dropdown.  Each shade can be included in multiple groups.</p>';
        html += '<hr></hr>';
        html += `<div class="field-group" style="text-align:center;background-color:white;border-radius:5px;">`;
        html += `<select id="selAvailShades" style="font-size:22px;min-width:277px;text-align:center;" data-bind="shadeId" data-datatype="int" onchange="document.getElementById('divWizShadeName').innerHTML = this.options[this.selectedIndex].text;"><options style="color:black;"></options></select><label for="selAvailShades">Select a Shade</label></div >`;
        html += '</div>';

        html += '<div class="wizard-step" data-stepid="3">';
        html += '<p style="font-size:14px;">Now that you have chosen a shade to pair.  Open the memory for the shade by pressing the OPEN MEMORY button.  The shade should jog to indicate the memory has been opened.</p>';
        html += '<p style="font-size:14px;">The motor should jog only once.  If it jogs more than once then you have again closed the memory on the motor. Once the command is sent to the motor you will be asked if the motor successfully jogged.</p><p style="font-size:14px;">If it did then press YES if not press no and click the OPEN MEMORY button again.</p>';
        html += '<hr></hr>';
        html += '<div id="divWizShadeName" style="text-align:center;font-size:22px;"></div>';
        html += '<div class="button-container"><button type="button" id="btnOpenMemory">Open Memory</button></div>';
        html += '<hr></hr>';
        html += '</div>';

        html += '<div class="wizard-step" data-stepid="4">';
        html += '<p style="font-size:14px;">Now that the memory is opened on the motor you need to send the pairing command for the group.</p>';
        html += '<p style="font-size:14px;">To do this press the PAIR TO GROUP button below and once the motor jogs the process will be complete.</p>';
        html += '<hr></hr>';
        html += '<div id="divWizShadeName" style="text-align:center;font-size:22px;"></div>';
        html += '<div class="button-container"><button type="button" id="btnPairToGroup">Pair to Group</button></div>';
        html += '<hr></hr>';
        html += '</div>';



        html += `<div class="button-container" style="text-align:center;"><button id="btnPrevStep" type="button" style="padding-left:20px;padding-right:20px;width:37%;margin-right:10px;display:inline-block;" onclick="ui.wizSetPrevStep(document.getElementById('divLinkGroup'));">Go Back</button><button id="btnNextStep" type="button" style="padding-left:20px;padding-right:20px;width:37%;display:inline-block;" onclick="ui.wizSetNextStep(document.getElementById('divLinkGroup'));">Next</button></div>`;
        html += `<div class="button-container" style="text-align:center;"><button id="btnStopLinking" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;width:calc(100% - 100px);" onclick="document.getElementById('divLinkGroup').remove();">Cancel</button></div>`;
        html += '</div>';
        div.innerHTML = html;
        document.getElementById('divContainer').appendChild(div);
        ui.wizSetStep(div, 1);
        let btnOpenMemory = div.querySelector('#btnOpenMemory');
        btnOpenMemory.addEventListener('click', (evt) => {
            let obj = ui.fromElement(div);
            console.log(obj);
            putJSONSync('/shadeCommand', { shadeId: obj.shadeId, command: 'prog', repeat: 40 }, (err, shade) => {
                if (err) ui.serviceError(err);
                else {
                    let prompt = ui.promptMessage('Confirm Motor Response', () => {
                        ui.wizSetNextStep(document.getElementById('divLinkGroup'));
                        prompt.remove();
                    });
                    prompt.querySelector('.sub-message').innerHTML = `<hr></hr><p>Did the shade jog? If the shade jogged press the YES button if not then press the NO button and try again.</p><p>Once the shade has jogged the motor memory will be ready to add the shade to the group.</p>`;
                }
            });
        });
        let btnPairToGroup = div.querySelector('#btnPairToGroup');
        btnPairToGroup.addEventListener('click', (evt) => {
            let obj = ui.fromElement(div);
            putJSONSync('/groupCommand', { groupId: groupId, command: 'prog', repeat: 1 }, (err, shade) => {
                if (err) ui.serviceError(err);
                else {
                    let prompt = ui.promptMessage('Confirm Motor Response', () => {
                        putJSONSync('/linkToGroup', { groupId: groupId, shadeId: obj.shadeId }, (err, group) => {
                            console.log(group);
                            somfy.setLinkedShadesList(group);
                            this.updateGroupList();
                        });
                        prompt.remove();
                        div.remove();
                    });
                    prompt.querySelector('.sub-message').innerHTML = `<hr></hr><p>Did the shade jog?  If the shade jogged press the YES button and your shade will be linked to the group.  If it did not press the NO button and try again.</p></p><p>Once the shade has jogged the shade will be added to the group and this process will be finished.</p>`;
                }
            });
        });
        getJSONSync(`/groupOptions?groupId=${groupId}`, (err, options) => {
            if (err) {
                div.remove();
                ui.serviceError(err);
            }
            else {
                console.log(options);
                if (options.availShades.length > 0) {
                    // Add in all the available shades.
                    let selAvail = div.querySelector('#selAvailShades');
                    let grpName = div.querySelector('#divGroupName');
                    if (grpName) grpName.innerHTML = options.name;
                    for (let i = 0; i < options.availShades.length; i++) {
                        let shade = options.availShades[i];
                        selAvail.options.add(new Option(shade.name, shade.shadeId));
                    }
                    let divWizShadeName = div.querySelector('#divWizShadeName');
                    if (divWizShadeName) divWizShadeName.innerHTML = options.availShades[0].name;
                }
                else {
                    div.remove();
                    ui.errorMessage('There are no available shades to pair to this group.');
                }
            }
        });
        return div;
    }
    unlinkGroupShade(groupId, shadeId) {
        let div = document.createElement('div');
        let html = `<div id="divUnlinkGroup" class="inst-overlay wizard" data-type="link-shade" data-groupid="${groupId}" data-stepid="1">`;
        html += '<div style="width:100%;text-align:center;font-weight:bold;"><div style="padding:10px;display:inline-block;width:100%;color:#00bcd4;border-radius:5px;border-top-right-radius:17px;border-top-left-radius:17px;background:white;"><div>REMOVE SHADE FROM GROUP</div><div id="divGroupName" style="font-size:14px;"></div></div></div>';

        html += '<div class="wizard-step" data-stepid="1">';
        html += '<p style="font-size:14px;">This wizard will walk you through the steps required to remove a shade from a group.  Follow all instructions at each step until the shade is removed from the group.</p>';
        html += '<p style="font-size:14px;">During this process the shade should jog exactly two times.  The first time indicates that the motor memory has been enabled and the second time removes the group from the motor memory</p>';
        html += '<p style="font-size:14px;">Each shade must be removed from the group individually.  When you are ready to begin unpairing your shade from the group press the NEXT button to begin.</p><hr></hr>';
        html += '</div>';

        html += '<div class="wizard-step" data-stepid="2">';
        html += '<p style="font-size:14px;">You must first open the memory for the shade by pressing the OPEN MEMORY button.  The shade should jog to indicate the memory has been opened.</p>';
        html += '<p style="font-size:14px;">The motor should jog only once.  If it jogs more than once then you have again closed the memory on the motor. Once the motor has jogged press the NEXT button to proceed.</p>';
        html += '<hr></hr>';
        html += '<div id="divWizShadeName" style="text-align:center;font-size:22px;"></div>';
        html += '<div class="button-container"><button type="button" id="btnOpenMemory">Open Memory</button></div>';
        html += '<hr></hr>';
        html += '</div>';

        html += '<div class="wizard-step" data-stepid="3">';
        html += '<p style="font-size:14px;">Now that the memory is opened on the motor you need to send the un-pairing command for the group.</p>';
        html += '<p style="font-size:14px;">To do this press the UNPAIR FROM GROUP button below and once the motor jogs the process will be complete.</p>';
        html += '<hr></hr>';
        html += '<div id="divWizShadeName" style="text-align:center;font-size:22px;"></div>';
        html += '<div class="button-container"><button type="button" id="btnUnpairFromGroup">Unpair from Group</button></div>';
        html += '<hr></hr>';
        html += '</div>';
        html += `<div class="button-container" style="text-align:center;"><button id="btnPrevStep" type="button" style="padding-left:20px;padding-right:20px;width:37%;margin-right:10px;display:inline-block;" onclick="ui.wizSetPrevStep(document.getElementById('divUnlinkGroup'));">Go Back</button><button id="btnNextStep" type="button" style="padding-left:20px;padding-right:20px;width:37%;display:inline-block;" onclick="ui.wizSetNextStep(document.getElementById('divUnlinkGroup'));">Next</button></div>`;
        html += `<div class="button-container" style="text-align:center;"><button id="btnStopLinking" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;width:calc(100% - 100px);" onclick="document.getElementById('divUnlinkGroup').remove();">Cancel</button></div>`;
        html += '</div>';
        div.innerHTML = html;
        document.getElementById('divContainer').appendChild(div);
        ui.wizSetStep(div, 1);
        let btnOpenMemory = div.querySelector('#btnOpenMemory');
        btnOpenMemory.addEventListener('click', (evt) => {
            let obj = ui.fromElement(div);
            console.log(obj);
            putJSONSync('/shadeCommand', { shadeId: shadeId, command: 'prog', repeat: 40 }, (err, shade) => {
                if (err) ui.serviceError(err);
                else {
                    let prompt = ui.promptMessage('Confirm Motor Response', () => {
                        ui.wizSetNextStep(document.getElementById('divUnlinkGroup'));
                        prompt.remove();
                    });
                    prompt.querySelector('.sub-message').innerHTML = `<hr></hr><p>Did the shade jog? If the shade jogged press the YES button if not then press the NO button and try again.</p><p>If you are having trouble getting the motor to jog on this step you may try to open the memory using a remote.  Most often this is done by selecting the channel, then a long press on the prog button.</p><p>If you opened the memory using the alternate method press the NO button to close this message, then press NEXT button to skip the step.</p>`;
                }
            });
        });
        let btnUnpairFromGroup = div.querySelector('#btnUnpairFromGroup');
        btnUnpairFromGroup.addEventListener('click', (evt) => {
            let obj = ui.fromElement(div);
            putJSONSync('/groupCommand', { groupId: groupId, command: 'prog', repeat: 1 }, (err, shade) => {
                if (err) ui.serviceError(err);
                else {
                    let prompt = ui.promptMessage('Confirm Motor Response', () => {
                        putJSONSync('/unlinkFromGroup', { groupId: groupId, shadeId: shadeId }, (err, group) => {
                            console.log(group);
                            somfy.setLinkedShadesList(group);
                            this.updateGroupList();
                        });
                        prompt.remove();
                        div.remove();
                    });
                    prompt.querySelector('.sub-message').innerHTML = `<hr></hr><p>Did the shade jog? If the shade jogged press the YES button if not then press the NO button and try again.</p><p>Once the shade has jogged the shade will be removed from the group and this process will be finished.</p>`;
                }
            });
        });
        getJSONSync(`/group?groupId=${groupId}`, (err, group) => {
            if (err) {
                div.remove();
                ui.serviceError(err);
            }
            else {
                console.log(group);
                console.log(shadeId);
                let shade = group.linkedShades.find((x) => { return shadeId === x.shadeId; });
                if (typeof shade !== 'undefined') {
                    // Add in all the available shades.
                    let grpName = div.querySelector('#divGroupName');
                    if (grpName) grpName.innerHTML = group.name;
                    let divWizShadeName = div.querySelector('#divWizShadeName');
                    if (divWizShadeName) divWizShadeName.innerHTML = shade.name;
                }
                else {
                    div.remove();
                    ui.errorMessage('The specified shade could not be found in this group.');
                }
            }
        });
        return div;
    }
    unlinkRemote(shadeId, remoteAddress) {
        let prompt = ui.promptMessage('Are you sure you want to unlink this remote from the shade?', () => {
            let obj = {
                shadeId: shadeId,
                remoteAddress: remoteAddress
            };
            putJSONSync('/unlinkRemote', obj, (err, shade) => {

                console.log(shade);
                prompt.remove();
                this.setLinkedRemotesList(shade);
            });

        });
    }
    deviationChanged(el) {
        document.getElementById('spanDeviation').innerText = (el.value / 100).fmt('#,##0.00');
    }
    rxBandwidthChanged(el) {
        document.getElementById('spanRxBandwidth').innerText = (el.value / 100).fmt('#,##0.00');
    }
    frequencyChanged(el) {
        document.getElementById('spanFrequency').innerText = (el.value / 1000).fmt('#,##0.000');
    }
    txPowerChanged(el) {
        console.log(el.value);
        let lvls = [-30, -20, -15, -10, -6, 0, 5, 7, 10, 11, 12];
        document.getElementById('spanTxPower').innerText = lvls[el.value];
    }
    stepSizeChanged(el) {
        document.getElementById('spanStepSize').innerText = parseInt(el.value, 10).fmt('#,##0');
    }

    processShadeTarget(el, shadeId) {
        let positioner = document.querySelector(`.shade-positioner[data-shadeid="${shadeId}"]`);
        if (positioner) {
            positioner.querySelector(`.shade-target`).innerHTML = el.value;
            somfy.sendCommand(shadeId, el.value);
        }
    }
    processShadeTiltTarget(el, shadeId) {
        let positioner = document.querySelector(`.shade-positioner[data-shadeid="${shadeId}"]`);
        if (positioner) {
            positioner.querySelector(`.shade-tilt-target`).innerHTML = el.value;
            somfy.sendTiltCommand(shadeId, el.value);
        }
    }
    openSetPosition(shadeId) {
        console.log('Opening Shade Positioner');
        if (typeof shadeId === 'undefined') {
            return;
        }
        else {
            let shade = document.querySelector(`div.somfyShadeCtl[data-shadeid="${shadeId}"]`);
            if (shade) {
                let ctls = document.querySelectorAll('.shade-positioner');
                for (let i = 0; i < ctls.length; i++) {
                    console.log('Closing shade positioner');
                    ctls[i].remove();
                }

                let currPos = parseInt(shade.getAttribute('data-target'), 0);
                let elname = shade.querySelector(`.shadectl-name`);
                let shadeName = elname.innerHTML;
                let html = `<div class="shade-name">${shadeName}</div>`;
                html += `<input id="slidShadeTarget" name="shadeTarget" type="range" min="0" max="100" step="1" value="${currPos}" onchange="somfy.processShadeTarget(this, ${shadeId});" oninput="document.getElementById('spanShadeTarget').innerHTML = this.value;" />`;
                html += `<label for="slidShadeTarget"><span>Target Position </span><span><span id="spanShadeTarget" class="shade-target">${currPos}</span><span>%</span></span></label>`;
                if (makeBool(shade.getAttribute('data-tilt'))) {
                    let currTiltPos = parseInt(shade.getAttribute('data-tilttarget'), 10);
                    html += `<input id="slidShadeTiltTarget" name="shadeTarget" type="range" min="0" max="100" step="1" value="${currTiltPos}" onchange="somfy.processShadeTiltTarget(this, ${shadeId});" oninput="document.getElementById('spanShadeTiltTarget').innerHTML = this.value;" />`;
                    html += `<label for="slidShadeTiltTarget"><span>Target Tilt Position </span><span><span id="spanShadeTiltTarget" class="shade-tilt-target">${currTiltPos}</span><span>%</span></span></label>`;
                }
                html += `</div>`;
                let div = document.createElement('div');
                div.setAttribute('class', 'shade-positioner');
                div.setAttribute('data-shadeid', shadeId);
                div.addEventListener('onclick', (event) => { event.stopPropagation(); });
                div.innerHTML = html;
                shade.appendChild(div);
                document.body.addEventListener('click', () => {
                    let ctls = document.querySelectorAll('.shade-positioner');
                    for (let i = 0; i < ctls.length; i++) {
                        console.log('Closing shade positioner');
                        ctls[i].remove();
                    }
                }, { once: true });
            }
        }
    }
}
var somfy = new Somfy();
class MQTT {
    initialized = false;
    init() { this.initialized = true; }
    async loadMQTT() {
        getJSONSync('/mqttsettings', (err, settings) => {
            if (err) 
                console.log(err);
            else {
                console.log(settings);
                ui.toElement(document.getElementById('divMQTT'), { mqtt: settings });
            }
        });
    }
    connectMQTT() {
        let obj = ui.fromElement(document.getElementById('divMQTT'));
        console.log(obj);
        if (obj.mqtt.enabled) {
            if (typeof obj.mqtt.hostname !== 'string' || obj.mqtt.hostname.length === 0) {
                ui.errorMessage('Invalid host name').querySelector('.sub-message').innerHTML = 'You must supply a host name to connect to MQTT.';
                return;
            }
            if (obj.mqtt.hostname.length > 64) {
                ui.errorMessage('Invalid host name').querySelector('.sub-message').innerHTML = 'The maximum length of the host name is 64 characters.';
                return;
            }
            if (isNaN(obj.mqtt.port) || obj.mqtt.port < 0) {
                ui.errorMessage('Invalid port number').querySelector('.sub-message').innerHTML = 'Likely ports are 1183, 8883 for MQTT/S or 80,443 for HTTP/S';
                return;
            }
            if (typeof obj.mqtt.username === 'string' && obj.mqtt.username.length > 32) {
                ui.errorMessage('Invalid Username').querySelector('.sub-message').innerHTML = 'The maximum length of the username is 32 characters.';
                return;
            }
            if (typeof obj.mqtt.password === 'string' && obj.mqtt.password.length > 32) {
                ui.errorMessage('Invalid Password').querySelector('.sub-message').innerHTML = 'The maximum length of the password is 32 characters.';
                return;
            }
            if (typeof obj.mqtt.rootTopic === 'string' && obj.mqtt.rootTopic.length > 64) {
                ui.errorMessage('Invalid Root Topic').querySelector('.sub-message').innerHTML = 'The maximum length of the root topic is 64 characters.';
                return;
            }
        }
        putJSONSync('/connectmqtt', obj.mqtt, (err, response) => {
            if (err) ui.serviceError(err);
            console.log(response);
        });
    }
}
var mqtt = new MQTT();
class Firmware {
    initialized = false;
    init() { this.initialized = true; }
    isMobile() {
        let agt = navigator.userAgent.toLowerCase();
        return /Android|iPhone|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
    }
    backup() {
        var link = document.createElement('a');
        link.href = '/backup';
        link.setAttribute('download', 'backup');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    restore() {
        let div = this.createFileUploader('/restore');
        let inst = div.querySelector('div[id=divInstText]');
        inst.innerHTML = '<div style="font-size:14px;margin-bottom:20px;">Select a backup file that you would like to restore then press the Upload File button.</div>';
        document.getElementById('divContainer').appendChild(div);
    }
    createFileUploader(service) {
        let div = document.createElement('div');
        div.setAttribute('id', 'divUploadFile');
        div.setAttribute('class', 'inst-overlay');
        div.style.width = '100%';
        div.style.alignContent = 'center';
        let html = `<div style="width:100%;text-align:center;"><form method="POST" action="#" enctype="multipart/form-data" id="frmUploadApp" style="">`;
        html += `<div id="divInstText"></div>`;
        html += `<input id="fileName" type="file" name="updateFS" style="display:none;" onchange="document.getElementById('span-selected-file').innerText = this.files[0].name;"/>`;
        html += `<label for="fileName">`;
        html += `<span id="span-selected-file" style="display:inline-block;width:calc(100% - 47px);border-bottom:solid 2px white;font-size:14px;white-space:nowrap;overflow:hidden;max-width:320px;text-overflow:ellipsis;"></span>`;
        html += `<div id="btn-select-file" class="button-outline" style="font-size:.8em;padding:10px;"><i class="icss-upload" style="margin:0px;"></i></div>`;
        html += `</label>`;
        html += `<div class="progress-bar" id="progFileUpload" style="--progress:0%;margin-top:10px;display:none;"></div>`;
        html += `<div class="button-container">`;
        html += `<button id="btnBackupCfg" type="button" style="display:none;width:auto;padding-left:20px;padding-right:20px;margin-right:4px;" onclick="firmware.backup();">Backup</button>`;
        html += `<button id="btnUploadFile" type="button" style="width:auto;padding-left:20px;padding-right:20px;margin-right:4px;display:inline-block;" onclick="firmware.uploadFile('${service}', document.getElementById('divUploadFile'));">Upload File</button>`;
        html += `<button id="btnClose" type="button" style="width:auto;padding-left:20px;padding-right:20px;display:inline-block;" onclick="document.getElementById('divUploadFile').remove();">Cancel</button></div>`;
        html += `</form><div>`;
        div.innerHTML = html;
        return div;
    }
    updateFirmware() {
        let div = this.createFileUploader('/updateFirmware');
        let inst = div.querySelector('div[id=divInstText]');
        inst.innerHTML = '<div style="font-size:14px;margin-bottom:20px;">Select a binary file [SomfyController.ino.esp32.bin] containing the device firmware then press the Upload File button.</div>';
        document.getElementById('divContainer').appendChild(div);
    }
    updateApplication() {
        let div = this.createFileUploader('/updateApplication');
        general.reloadApp = true;
        let inst = div.querySelector('div[id=divInstText]');
        inst.innerHTML = '<div style="font-size:14px;">Select a binary file [SomfyController.littlefs.bin] containing the littlefs data for the application then press the Upload File button.</div>';
        if (this.isMobile()) {
            inst.innerHTML += `<div style="width:100%;color:red;text-align:center;font-weight:bold;"><span style="margin-top:7px;width:100%;background:yellow;padding:3px;display:inline-block;border-radius:5px;background:white;">WARNING<span></div>`;
            inst.innerHTML += '<hr/><div style="font-size:14px;margin-bottom:10px;">This browser does not support automatic backups.  It is highly recommended that you back up your configuration using the backup button before proceeding.</div>';
        }
        else
            inst.innerHTML += '<hr/><div style="font-size:14px;margin-bottom:10px;">A backup file for your configuration will be downloaded to your browser.  If the application update process fails please restore this file using the restore button</div>';
        document.getElementById('divContainer').appendChild(div);
        if(this.isMobile()) document.getElementById('btnBackupCfg').style.display = 'inline-block';
    }
    async uploadFile(service, el) {
        let field = el.querySelector('input[type="file"]');
        let filename = field.value;
        console.log(filename);
        switch (service) {
            case '/updateApplication':
                if (typeof filename !== 'string' || filename.length === 0) {
                    ui.errorMessage('You must select a littleFS binary file to proceed.');
                    return;
                }
                else if (filename.indexOf('.littlefs') === -1 || !filename.endsWith('.bin')) {
                    ui.errorMessage('This file is not a valid littleFS binary file.');
                    return;
                }
                if (!this.isMobile()) {
                    // The first thing we need to do is backup the configuration. So lets do this
                    // in a promise.
                    await new Promise((resolve, reject) => {
                        firmware.backup();
                        try {
                            // Next we need to download the current configuration data.
                            getText('/shades.cfg', (err, cfg) => {
                                if (err)
                                    reject(err);
                                else {
                                    resolve();
                                    console.log(cfg);
                                }
                            });
                        } catch (err) {
                            ui.serviceError(el, err);
                            reject(err);
                            return;
                        }
                    }).catch((err) => {
                        ui.serviceError(el, err);
                    });
                }
                break;
            case '/updateFirmware':
                if (typeof filename !== 'string' || filename.length === 0) {
                    ui.errorMessage('You must select a valid firmware binary file to proceed.');
                    return;
                }
                else if (filename.indexOf('.ino.') === -1 || !filename.endsWith('.bin')) {
                    ui.errorMessage(el, 'This file is not a valid firmware binary file.');
                    return;
                }
                break;
            case '/restore':
                if (typeof filename !== 'string' || filename.length === 0) {
                    ui.errorMessage('You must select a valid backup file to proceed.');
                    return;
                }
                else if (!filename.endsWith('.backup') || filename.indexOf('ESPSomfyRTS') === -1) {
                    ui.errorMessage(el, 'This file is not a valid backup file');
                    return;
                }
                break;
        }
        let formData = new FormData();
        let btnUpload = el.querySelector('button[id="btnUploadFile"]');
        let btnCancel = el.querySelector('button[id="btnClose"]');
        let btnBackup = el.querySelector('button[id="btnBackupCfg"]');
        btnBackup.style.display = 'none';
        btnUpload.style.display = 'none';
        field.disabled = true;
        let btnSelectFile = el.querySelector('div[id="btn-select-file"]');
        let prog = el.querySelector('div[id="progFileUpload"]');
        prog.style.display = '';
        btnSelectFile.style.visibility = 'hidden';
        formData.append('file', field.files[0]);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', service, true);
        xhr.upload.onprogress = function (evt) {
            let pct = evt.total ? Math.round((evt.loaded / evt.total) * 100) : 0;
            prog.style.setProperty('--progress', `${pct}%`);
            prog.setAttribute('data-progress', `${pct}%`);
            console.log(evt);
            
        };
        xhr.onerror = function (err) {
            console.log(err);
            ui.serviceError(el, err);
        };
        xhr.onload = function () {
            console.log('File upload load called');
            btnCancel.innerText = 'Close';
            switch (service) {
                case '/restore':
                    (async () => {
                        await somfy.init();
                        if (document.getElementById('divUploadFile')) document.getElementById('divUploadFile').remove();
                    })();
                    break;
                case '/updateApplication':

                    break;
            }
        };
        xhr.send(formData);
    }
}
var firmware = new Firmware();

