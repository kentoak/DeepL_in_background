var token = "{YOUR DEEPL API FOR FREE}";//ここにDeepLのAPIを文字列で入力e.g. var token = 'ed24b1xxxxx-f325-ee3f-xxxx-999999bd683a8:fx';

function selectionOnClick(info, tab) {
    var keyword = sendTextToDeepL(info.selectionText);
    var targetLang = 'EN';
    var sourceLang = 'JA';
    //await translate(sourceLang, targetLang, keyword);
    if (keyword != '') {
        if(includeJa(keyword)){//ja2en
            //keyword=encodeURIComponent(keyword)
        }
        else{//en2ja
            targetLang = "JA"
            sourceLang = "EN";
        }
        deeplTranslate(targetLang, sourceLang, keyword)
    }
}

function sendTextToDeepL(inString) {
    //var input = encodeURIComponent(inString);
    var input = inString;
    setText = input.replace('，', '、').replace('．', '。').replace(/([^\x01-\x7E\uFF61-\uFF9F]) +([^\x01-\x7E\uFF61-\uFF9F])/g, '$1$2').replace(/([^\x01-\x7E\uFF61-\uFF9F]) +([A-Za-z0-9])/g, '$1$2').replace(/([A-Za-z0-9]) +([^\x01-\x7E\uFF61-\uFF9F])/g, '$1$2').replace(/([^\x01-\x7E\uFF61-\uFF9F]),/g,'$1、').replace(/(^[^\x01-\x7E]*$)\．+/g, '$1。').replace(/(^[^\x01-\x7E])、+([^\x01-\x7E])/g, '$1, $2').replace(/([^\x01-\x7E\uFF61-\uFF9F])\./, '$1。').replace(/(^[^\x01-\x7E]*$)。+/g, '$1.').replace(/([^\x01-\x7E]):+([^\x01-\x7E])/g, '$1: $2');
    return setText
}

async function deeplTranslate(targetLang,sourceLang,keyword){
    var url = new URL("https://api-free.deepl.com/v2/translate"+ '?' + "auth_key=" + token + "&text=" + keyword + "&target_lang=" + targetLang + "&source_lang=" + sourceLang);
    var url_ = "https://api-free.deepl.com/v2/translate"
    var options = {
        method: "POST",
        headers:{"Content-Type": "application/x-www-form-urlencoded"},
        body: "auth_key=" + token + "&text=" + keyword + "&target_lang=" + targetLang + "&source_lang=" + sourceLang
    }
    //const response = await fetch(url.toString());
    const response = await fetch(url_,options);
    const data = response.ok ? await response.json() : null;
    const source = keyword;
    var target = data?.translations?.[0]?.text;
    for(var i=0; i<10; i++){
        target = target.replace('，', '、').replace('．', '。').replace(/([^\x01-\x7E\uFF61-\uFF9F]) +([^\x01-\x7E\uFF61-\uFF9F])/g, '$1$2').replace(/([^\x01-\x7E\uFF61-\uFF9F]) +([A-Za-z0-9])/g, '$1$2').replace(/([A-Za-z0-9]) +([^\x01-\x7E\uFF61-\uFF9F])/g, '$1$2').replace(/([^\x01-\x7E\uFF61-\uFF9F]),/g,'$1、').replace(/(^[^\x01-\x7E]*$)\．+/g, '$1。').replace(/(^[^\x01-\x7E])、+([^\x01-\x7E])/g, '$1, $2').replace(/([^\x01-\x7E\uFF61-\uFF9F])\./, '$1。').replace(/(^[^\x01-\x7E]*$)。+/g, '$1.').replace(/([^\x01-\x7E]):+([^\x01-\x7E])/g, '$1: $2');
    }
    var target1 = target
    saveToClipboard(target1)
    var result = target1 ? { source, target1 } : null
    return result;
};

function ja2Bit(str){//日本語検出
  return (str.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/))? true : false
}

function includeJa(text) {
    let gmi = 'gmi';
    let regeIncludeHiragana = '^(?=.*[\u3041-\u3096]).*$';
    let regeIncludeKatakana = '^(?=.*[\u30A1-\u30FA]).*$';
    let regeIncludeKanji = '^(?=.*[\u4E00-\u9FFF]).*$';
    let regeHiragana = new RegExp(regeIncludeHiragana, gmi);
    let regeKatakana = new RegExp(regeIncludeKatakana, gmi);
    let regeKanji = new RegExp(regeIncludeKanji, gmi);
    let includeJa = false;
    if (regeHiragana.test(text))
        includeJa = true;
    if (regeKatakana.test(text))
        includeJa = true;
    if (regeKanji.test(text))
        includeJa = true;
    return includeJa;
}

function saveToClipboard(str) {//任意の文字列をクリップボードに入れる
    document.addEventListener('copy', (e) => {
        e.preventDefault();
        e.clipboardData.setData('text/plain', str);
    }, {once:true});
    document.execCommand('copy');
}


// right click context menu
const parent = chrome.contextMenus.create({
    "id" : "bgdl",
    "type" : "normal",
    "title" : "Translate %s by DeepL",
    "contexts" : ["all"],
    "onclick" : selectionOnClick
});
