async function tts(text, lang, options = {}) {

    const {
        config,
        utils
    } = options;


    const {
        tauriFetch
    } = utils;


    let {
        requestPath,
        apiKey,
        voice
    } = config;



    if (
        requestPath === undefined ||
        requestPath.length === 0
    ) {

        requestPath =
            "https://tts.leawsic.ltd";

    }


    if (!requestPath.startsWith("http")) {

        requestPath =
            "https://" + requestPath;

    }



    if (
        voice === undefined ||
        voice.length === 0
    ) {

        voice =
            getVoice(lang);

    }



    const res =
        await tauriFetch(

            `${requestPath}/v1/audio/speech`,

            {

                method:"POST",

                headers:{

                    "Authorization":
                    `Bearer ${apiKey}`,

                    "Content-Type":
                    "application/json"

                },


                body:JSON.stringify({

                    model:
                    "tts-1",

                    input:
                    text,

                    voice:
                    voice,

                    response_format:
                    "mp3"

                })

            }

        );



    if (!res.ok) {

        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;

    }



    let audio;



    /*
      OpenAI TTS 返回二进制
      转成 base64 给 Pot
    */


    if (
        res.data instanceof ArrayBuffer
    ) {

        audio =
            arrayBufferToBase64(
                res.data
            );

    }

    else if (
        res.data instanceof Uint8Array
    ){

        audio =
            uint8ArrayToBase64(
                res.data
            );

    }

    else if (
        typeof res.data === "string"
    ){

        audio =
            res.data;

    }

    else {

        throw JSON.stringify(res.data);

    }



    return audio;

}





function getVoice(lang){


    switch(lang){


        case "zh_cn":

            return "zh-CN-XiaoxiaoNeural";


        case "zh_tw":

            return "zh-TW-HsiaoChenNeural";


        case "ja":

            return "ja-JP-NanamiNeural";


        case "ko":

            return "ko-KR-SunHiNeural";


        case "en":

            return "en-US-AriaNeural";


        default:

            return "zh-CN-XiaoxiaoNeural";

    }

}





function arrayBufferToBase64(buffer){

    let binary = "";

    let bytes =
        new Uint8Array(buffer);


    for(
        let i=0;
        i<bytes.length;
        i++
    ){

        binary +=
        String.fromCharCode(
            bytes[i]
        );

    }


    return btoa(binary);

}





function uint8ArrayToBase64(bytes){

    let binary = "";

    for(
        let i=0;
        i<bytes.length;
        i++
    ){

        binary +=
        String.fromCharCode(
            bytes[i]
        );

    }


    return btoa(binary);

}
