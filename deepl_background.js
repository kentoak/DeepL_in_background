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
    setText = input.replace(/([^\w.]) +([^\w.])/g, '$1$2').replace(/([\w.]) +([^\w.])/g, '$1$2').replace(/([^\w.]) +([\w.])/g, '$1$2').replace(/([^\w.]),+([^\w.])/g, '$1、$2').replace(/([^\w.])，+([^\w.])/g, '$1、$2').replace(/([^\w.])\.+/g, '$1。').replace(/([^\w.])\．+/g, '$1。').replace(/([\w.])、+([\w.])/g, '$1,$2').replace(/([\w.])。+/g, '$1.').replace(/([\w.]):+([\w.])/g, '$1: $2');//半角スペースの繰り返しを消す //([^\w.])は全角 //+は直前の1回以上の繰り返し //カッコ()が＄の番号//半角+半角スペース+全角の半角スペースと、全角+半角スペース+半角の半角スペースも消す。//全角ピリオド、全角カンマにも対応//半角:半角のときには半角スペースを入れる。//半角スペースの繰り返しを消す //([^\w.])は全角 //+は直前の1回以上の繰り返し //カッコ()が＄の番号( )、カッコ内をグループ化。マッチした内容は参照可//gオプションは置き換えたい文字列を指定した時にその文字が複数含まれている場合に、その全てを置き換えるオプション
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
    const target = data?.translations?.[0]?.text;
    //window.alert(target)
    saveToClipboard(target)
    var result = target ? { source, target } : null
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
